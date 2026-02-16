import { SourceType } from './types';

export const GEMINI_MODEL_NAME = "gemini-3-flash-preview";

// Defines the reasonable range of conceptual "mentions" or "items" (tweets, comments, videos etc.)
// that a single, specific issue might draw from each platform.
// These are not the total items scanned on the platform, but the count relevant to ONE issue.
export const OCCURRENCE_CONTRIBUTION_RANGES: { [key in SourceType]: { min: number; max: number } } = {
  [SourceType.Tweets]: { min: 50, max: 2000 },           // e.g., 50-2000 tweets conceptually about this one issue
  [SourceType.RedditPosts]: { min: 20, max: 500 },        // e.g., 20-500 Reddit posts/comments about this issue
  [SourceType.TrustpilotPosts]: { min: 10, max: 300 }, // e.g., 10-300 Trustpilot reviews highlighting this issue
  [SourceType.YouTube]: { min: 1, max: 30 },              // e.g., 1-30 YouTube videos/comments focusing on this issue
  [SourceType.GoogleArticles]: { min: 1, max: 5 },       // e.g., 1-5 articles detailing this specific issue
};

export const SOURCE_TYPE_DISPLAY_NAMES: { [key in SourceType]: string } = {
  [SourceType.YouTube]: 'YouTube',
  [SourceType.GoogleArticles]: 'Google Articles',
  [SourceType.Tweets]: 'Tweets',
  [SourceType.RedditPosts]: 'Reddit Posts',
  [SourceType.TrustpilotPosts]: 'Trustpilot Posts',
};