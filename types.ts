

export enum SourceType {
  YouTube = 'YouTube',
  GoogleArticles = 'Google Articles',
  RedditPosts = 'Reddit Posts',
  Tweets = 'Tweets',
  TrustpilotPosts = 'Trustpilot Posts',
}

export interface Source {
  id: string;
  type: SourceType;
  url:string;
  title: string;
}

export interface OccurrenceDetails {
  [SourceType.Tweets]?: number;
  [SourceType.YouTube]?: number;
  [SourceType.RedditPosts]?: number;
  [SourceType.GoogleArticles]?: number;
  [SourceType.TrustpilotPosts]?: number;
}

export interface Issue {
  id: string;
  description: string;
  category: string;
  sources: Source[];
  occurrenceDetails: OccurrenceDetails;
  totalOccurrences: number;
  lastDetected: string; // ISO date string
}

// For Gemini response parsing
export interface GeminiSourceResponse {
    type: string; // Keep flexible from Gemini, map to SourceType later
    url: string;
    title: string;
}
export interface GeminiIssueResponse {
  description: string;
  category:string;
  sources: GeminiSourceResponse[];
}

// Data structure for a single product analysis instance
export interface ProductInstanceData {
  id: string; // Unique ID for this instance
  productName: string;
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  lastScanTimestamp: number | null;
  nextScanDue: number | null; // Calculated from lastScanTimestamp

  // Competitor data tied to this instance
  competitorProductName: string | null;
  competitorIssues: Issue[];
  isCompetitorLoading: boolean;
  competitorError: string | null;
}

// App-level data stored in localStorage
export interface AppStorage {
  productInstances: { [id: string]: ProductInstanceData }; // Store as object for easier ID-based access
  activeInstanceId: string | null;
  isAuthenticated?: boolean; // Keep auth related flags separate for clarity
  selectedPlan?: string | null;
  paymentCompleted?: boolean;
}

// For Advanced Filtering
export interface FilterState {
  keyword: string;
  category: string | null; // Single category for now, could be string[] for multi-select
  sourceType: SourceType | null; // Single source type
  startDate: string | null; // ISO date string YYYY-MM-DD
  endDate: string | null;   // ISO date string YYYY-MM-DD
}