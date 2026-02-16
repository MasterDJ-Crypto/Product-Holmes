

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Issue, Source, SourceType, GeminiIssueResponse, GeminiSourceResponse, OccurrenceDetails } from '../types';
import { GEMINI_MODEL_NAME, OCCURRENCE_CONTRIBUTION_RANGES } from '../constants';

const API_KEY = process.env.API_KEY;

const generateRandomAlphanumeric = (length: number = 7) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomDate = (): string => {
  const year = 2020 + Math.floor(Math.random() * 6); // 2020-2025
  const month = Math.floor(Math.random() * 12); 
  const day = Math.floor(Math.random() * 28) + 1; 
  return new Date(year, month, day).toISOString();
};

const mapGeminiSourceTypeToEnum = (geminiType: string): SourceType => {
    const sTypeLower = geminiType.toLowerCase().trim();
    if (sTypeLower.includes('youtube transcript')) return SourceType.YouTube; 
    if (sTypeLower.includes('youtube comment')) return SourceType.YouTube;
    if (sTypeLower.includes('youtube')) return SourceType.YouTube;
    if (sTypeLower.includes('google article') || sTypeLower.includes('article')) return SourceType.GoogleArticles;
    if (sTypeLower.includes('reddit post') || sTypeLower.includes('reddit')) return SourceType.RedditPosts;
    if (sTypeLower.includes('twitter post') || sTypeLower.includes('tweet') || sTypeLower.includes('twitter')) return SourceType.Tweets;
    if (sTypeLower.includes('trustpilot review') || sTypeLower.includes('trustpilot')) return SourceType.TrustpilotPosts;
    
    // Fallback if a more generic term is used by Gemini, attempt mapping
    const matchedSourceType = Object.values(SourceType).find(st => st.toLowerCase() === sTypeLower);
    if (matchedSourceType) {
      return matchedSourceType;
    }
    
    console.warn(`Unexpected source type from Gemini: '${geminiType}', defaulting to GoogleArticles.`);
    return SourceType.GoogleArticles; 
};

export const analyzeProductFeedback = async (productName: string, selectedPlan: string | null = 'free'): Promise<Issue[]> => {
  if (!API_KEY) {
    console.warn("Gemini API_KEY not found. Analysis unavailable.");
    throw new Error("Gemini API_KEY is not configured. Live analysis unavailable.");
  }

  let sourcesToScanPrompt = "";
  let featureMentionsPrompt = "";
  let geminiSourceTypeInstruction = "";
  let maxIssues = 5; 
  let allowedSourceTypesForGemini: string[] = [];
  let availableSourceTypesForOccurrences: SourceType[] = [];


  const normalizedPlan = selectedPlan?.toLowerCase() || 'free';

  if (normalizedPlan === 'free') {
    maxIssues = 4;
    sourcesToScanPrompt = `
      Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):
      1.  Google Articles: Analyze up to 10 relevant review articles and blog posts.
      2.  YouTube Transcripts: Analyze transcripts from up to 10 relevant YouTube videos.`;
    allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript"];
    availableSourceTypesForOccurrences = [SourceType.GoogleArticles, SourceType.YouTube];
    geminiSourceTypeInstruction = `          -   "type": Strictly one of ${JSON.stringify(allowedSourceTypesForGemini)}.
              (For YouTube Transcript, the title should imply it's from a transcript, e.g., "Transcript: ${productName} Overheats"). Ensure URLs are plausible fictional placeholders.`;
    featureMentionsPrompt = `Focus on clear, distinct issues or feature requests. Strive to identify as many unique and relevant points as possible, up to the maximum number allowed for this analysis tier. Avoid overly similar points. Do not perform semantic duplicate detection or prioritization.`;
  } else if (normalizedPlan === 'pro') {
    maxIssues = 10; 
    sourcesToScanPrompt = `
      Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):
      1.  Google Articles: Analyze up to 50 relevant review articles and blog posts.
      2.  YouTube (Transcripts & Comments): Analyze transcripts and a significant sample of comments from up to 50 relevant YouTube videos.
      3.  Twitter: Scan up to 5,000 tweets and related discussions.`;
    allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript", "YouTube Comment", "Twitter Post"];
    availableSourceTypesForOccurrences = [SourceType.GoogleArticles, SourceType.YouTube, SourceType.Tweets];
    geminiSourceTypeInstruction = `          -   "type": Strictly one of ${JSON.stringify(allowedSourceTypesForGemini)}.
              (For YouTube, the title should imply if it's from a transcript or comment. E.g., "Transcript: ${productName} UI Issues", "Comment on Video XYZ: ${productName} slow"). Ensure URLs are plausible fictional placeholders.`;
    featureMentionsPrompt = `Employ semantic duplicate detection to consolidate similar feedback into single, well-defined issues. Prioritize issues by their conceptual mention frequency across the scanned sources. Strive to identify as many unique and significant issues as possible, up to the maximum number allowed for this analysis tier, leveraging your consolidation capabilities.`;
  } else { // 'max'
    maxIssues = 50; 
    sourcesToScanPrompt = `
      Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):
      1.  Google Articles: Analyze up to 100 relevant review articles and blog posts.
      2.  YouTube (Transcripts & Comments): Analyze transcripts and a significant sample of comments from up to 100 relevant YouTube videos.
      3.  Twitter: Scan up to 10,000 tweets and related discussions.
      4.  Reddit: Search relevant subreddits for up to 5,000 posts and comments.
      5.  Trustpilot: Examine up to 5,000 product reviews.`;
    allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript", "YouTube Comment", "Twitter Post", "Reddit Post", "Trustpilot Review"];
    availableSourceTypesForOccurrences = [SourceType.GoogleArticles, SourceType.YouTube, SourceType.Tweets, SourceType.RedditPosts, SourceType.TrustpilotPosts];
    geminiSourceTypeInstruction = `          -   "type": Strictly one of ${JSON.stringify(allowedSourceTypesForGemini)}.
              (Titles should be descriptive, e.g., "Transcript: ${productName} battery", "Comment on Video ABC: ${productName} price", "Reddit Post: Feature request for ${productName}"). Ensure URLs are plausible fictional placeholders.`;
    featureMentionsPrompt = `Employ advanced semantic duplicate detection to consolidate similar feedback into single, well-defined issues. Prioritize issues by their conceptual mention frequency and sentiment across all scanned sources. Identify as many unique, significant issues as possible up to the limit, without sacrificing distinctiveness.`;
  }


  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
      You are ProductHolmes, an AI specializing in analyzing customer feedback for new products.
      For the product: "${productName}", your task is to identify and list DISTINCT issues, problems, bugs, negative feedback, and significant requested features that could improve the product.
      Prioritize actionable insights. Avoid generic positive comments unless they are part of a contrasting point to a specific issue.

      ${sourcesToScanPrompt}
      ${featureMentionsPrompt}

      Based on this comprehensive (simulated) scan, compile a list of up to ${maxIssues} distinct issues.
      Ensure each issue is genuinely distinct. If multiple sources report the same underlying problem (e.g., "battery drains fast" and "poor battery life"), consolidate this into a single, clearly described issue.
      If fewer than ${maxIssues} truly distinct and significant issues are found, return only those. Do not repeat or invent minor variations to reach the maximum number.

      For each distinct issue, provide:
      1.  A concise "description" of the issue (max 1-2 sentences, clearly stating the problem or request). Make the description specific to "${productName}" where appropriate, not overly generic.
      2.  A "category" from: "Bug", "Performance Issue", "Usability Problem", "Feature Request", "Negative Feedback", "Documentation Issue", "Connectivity Problem", "Hardware Issue", "Software Glitch", "Customer Support", "Pricing Concern", "Missing Feature", "Design Flaw", "Security Concern", "Compatibility Issue". Choose the most fitting.
      3.  A list of 2-4 simulated "sources" from where this issue was identified. Each source must have:
${geminiSourceTypeInstruction}
          -   "url": A plausible but entirely fictional placeholder URL. Generate these URLs using the following patterns, replacing [RANDOM_ID] with a unique 5-7 character alphanumeric string (e.g., 'ab12z', 'pqrst67'). 
              - YouTube: https://www.youtube.com/watch?v=example[RANDOM_ID]
              - Google Article: https://example-news.com/review/${productName.toLowerCase().replace(/\s+/g, '-')}/[RANDOM_ID]
              - Reddit Post: https://www.reddit.com/r/product_feedback/comments/[RANDOM_ID]/comment/another[RANDOM_ID]
              - Twitter Post: https://twitter.com/user[RANDOM_ID]/status/[RANDOM_ID_NUMERIC] (use a numeric random ID for status)
              - Trustpilot Review: https://www.trustpilot.com/reviews/[RANDOM_ID]
          -   "title": A realistic, concise title for the source. Example: "${productName} battery drain analysis (transcript)", "Google Article: ${productName} UI complaints", "Reddit user requests X feature for ${productName}", "Tweet about ${productName} crashing", "Trustpilot: ${productName} poor support".

      Format the entire output as a single, valid JSON array. Each element of the array must be an object strictly following this structure:
      {
        "description": "The specific issue or requested feature concerning ${productName}.",
        "category": "Performance Issue",
        "sources": [
          { "type": "YouTube Transcript", "url": "https://www.youtube.com/watch?v=exampleXYZ123", "title": "Video Transcript: ${productName} performance issues" },
          { "type": "Google Article", "url": "https://example.com/article/prodABC", "title": "Review of ${productName} highlighting bugs" }
        ]
      }
      Do not include any explanatory text, markdown formatting (like \`\`\`json), or anything else before or after the JSON array. The response must be ONLY the JSON array.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, 
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^[\s\n]*\`\`\`(?:json)?\s*\n?(.*?)\n?\s*\`\`\`[\s\n]*$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    let parsedData: unknown;
    try {
        parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini:", parseError, "\nOriginal text:", response.text);
        throw new Error(`AI response was not valid JSON. Content preview: ${response.text.substring(0,100)}...`);
    }

    if (!Array.isArray(parsedData) || !parsedData.every(item => 
        typeof item === 'object' && item !== null && 
        'description' in item && typeof item.description === 'string' &&
        'category' in item && typeof item.category === 'string' &&
        'sources' in item && Array.isArray(item.sources) &&
        item.sources.every((src: any) => 
            typeof src === 'object' && src !== null &&
            'type' in src && typeof src.type === 'string' &&
            'url' in src && typeof src.url === 'string' &&
            'title' in src && typeof src.title === 'string' &&
             src.url.startsWith('http') // Basic URL validation
        )
    )) {
        console.error("Invalid structure in parsed JSON from Gemini:", parsedData);
        throw new Error("AI response JSON structure is invalid or incomplete.");
    }
    
    const geminiIssues: GeminiIssueResponse[] = parsedData as GeminiIssueResponse[];
    

    return geminiIssues.map((geminiIssue, index): Issue => {
      const issueId = `issue_${Date.now()}_${index}_${generateRandomAlphanumeric(4)}`;
      
      const mappedSources: Source[] = geminiIssue.sources.map((src, srcIndex): Source => {
        const mappedType = mapGeminiSourceTypeToEnum(src.type);
        let finalUrl = src.url;
        if (!finalUrl.includes('example') && !finalUrl.includes(productName.toLowerCase().replace(/\s+/g, '-'))) {
            const randomId = generateRandomAlphanumeric();
            const randomNumericId = Math.floor(10000000000000000 + Math.random() * 90000000000000000).toString();
            switch(mappedType) {
                case SourceType.YouTube: finalUrl = `https://www.youtube.com/watch?v=example${randomId}`; break;
                case SourceType.GoogleArticles: finalUrl = `https://example-news.com/review/${productName.toLowerCase().replace(/\s+/g, '-')}/${randomId}`; break;
                case SourceType.RedditPosts: finalUrl = `https://www.reddit.com/r/product_feedback/comments/${randomId}/comment/another${generateRandomAlphanumeric()}`; break;
                case SourceType.Tweets: finalUrl = `https://twitter.com/user${randomId}/status/${randomNumericId}`; break;
                case SourceType.TrustpilotPosts: finalUrl = `https://www.trustpilot.com/reviews/${randomId}`; break;
                default: finalUrl = `https://example.com/generic/${randomId}`;
            }
        } else {
            if (!/example[A-Za-z0-9]{5,7}/.test(finalUrl) && !/comments\/[A-Za-z0-9]{5,7}/.test(finalUrl) && !/status\/[0-9]{10,19}/.test(finalUrl) && !/reviews\/[A-Za-z0-9]{5,7}/.test(finalUrl)) {
                finalUrl = finalUrl.replace(/(\?v=|\/comments\/|\/status\/|\/reviews\/)([A-Za-z0-9]*)$/, `$1${generateRandomAlphanumeric()}`);
                 if (mappedType === SourceType.Tweets && !/status\/[0-9]{10,19}/.test(finalUrl)) {
                     finalUrl = finalUrl.replace(/status\/([A-Za-z0-9_]*)$/, `status/${Math.floor(10000000000000000 + Math.random() * 90000000000000000).toString()}`);
                 }
            }
        }
        return {
          id: `${issueId}_source_${srcIndex}_${generateRandomAlphanumeric(3)}`,
          type: mappedType,
          url: finalUrl,
          title: src.title,
        };
      });

      let finalDisplayableSources: Source[] = mappedSources.filter(s => 
        availableSourceTypesForOccurrences.includes(s.type)
      );

      if (finalDisplayableSources.length === 0 && mappedSources.length > 0) {
        finalDisplayableSources = mappedSources.slice(0, 1); // Show at least one source Gemini provided, even if off-plan
      }
      
      const occurrenceDetails: OccurrenceDetails = {};
      let totalOccurrences = 0;
      
      const uniqueDisplayedSourceTypes = new Set(finalDisplayableSources.map(s => s.type));

      uniqueDisplayedSourceTypes.forEach(sourceType => {
        // Only generate occurrences if the source type is allowed by the plan for occurrence generation
        // AND it has a defined range.
        if (availableSourceTypesForOccurrences.includes(sourceType) && OCCURRENCE_CONTRIBUTION_RANGES[sourceType]) {
            const range = OCCURRENCE_CONTRIBUTION_RANGES[sourceType];
            const count = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            occurrenceDetails[sourceType] = count;
            totalOccurrences += count;
        }
      });
      
      // If totalOccurrences is still 0, but there are displayable sources for which counts *could* have been generated,
      // ensure at least one of them gets a count. This primarily addresses cases where Gemini might return fewer sources than expected.
      if (totalOccurrences === 0 && finalDisplayableSources.length > 0) {
          const firstEligibleSourceForCount = finalDisplayableSources.find(
              s => availableSourceTypesForOccurrences.includes(s.type) && OCCURRENCE_CONTRIBUTION_RANGES[s.type]
          );
          if (firstEligibleSourceForCount) {
              const sourceType = firstEligibleSourceForCount.type;
              const range = OCCURRENCE_CONTRIBUTION_RANGES[sourceType];
              const count = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
              occurrenceDetails[sourceType] = count;
              totalOccurrences += count;
          }
      }

      return {
        id: issueId,
        description: geminiIssue.description,
        category: geminiIssue.category,
        sources: finalDisplayableSources,
        occurrenceDetails,
        totalOccurrences,
        lastDetected: generateRandomDate(),
      };
    });

  } catch (error: any) {
    console.error("Error calling Gemini API or processing response:", error);
    if (error.message && error.message.includes("API_KEY")) {
        throw error; 
    } else if (error.message && error.message.includes("JSON")) {
         throw new Error(`Holmes had trouble understanding the intel (AI response format issue). Please try again. Details: ${error.message}`);
    }
    throw new Error(`Holmes encountered an unexpected snag while investigating "${productName}". Please try again. If the problem persists, contact support.`);
  }
};
