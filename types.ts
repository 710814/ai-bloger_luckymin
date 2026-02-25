export enum LoadingState {
  Idle = 'IDLE',
  TopicIdeas = 'TOPIC_IDEAS',
  KeywordsAndTags = 'KEYWORDS_AND_TAGS',
  Post = 'POST',
  Repurpose = 'REPURPOSE',
  Translate = 'TRANSLATE',
  SavingPost = 'SAVING_POST',
}

export interface BlogPost {
  id: string;
  pageId?: string;
  title: string;
  htmlContent: string;
  markdownContent: string;
}

// Fix: Add missing NotionPostInfo interface
export interface NotionPostInfo {
  pageId: string;
  title: string;
}

export type RepurposeType = 'youtubeScript' | 'shortsIdeas' | 'threadsPosts';
export type TranslateLanguage = 'English' | 'Chinese' | 'Spanish';
export type WordCount = 'short' | 'medium' | 'long' | '';