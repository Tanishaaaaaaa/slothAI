export type AppTab = 'overview' | 'chat-condenser' | 'fridge-chef' | 'tidy-desk' | 'wind-down' | 'dev-submission';

export interface ChatCondenseResult {
  summary: string;
  actionItems: string[];
  dramaFilter: string;
  fomoVerdict: string;
  energySavedMinutes: number;
  provider: string;
}

export interface SlothRecipe {
  name: string;
  prepMinutes: number;
  cookMinutes: number;
  panCount: number;
  effortScore: string;
  ingredientsUsed: string[];
  instructions: string[];
  slothTip: string;
}

export interface FridgeScanResult {
  detectedIngredients: string[];
  slothRecipes: SlothRecipe[];
  missingStaples: string[];
  provider: string;
}

export interface TidyItem {
  original: string;
  suggestedName: string;
  action: 'Archive' | 'Delete' | 'File';
}

export interface TidyCategory {
  folderName: string;
  description: string;
  items: TidyItem[];
}

export interface TidyResult {
  categories: TidyCategory[];
  bashScript: string;
  slothProTip: string;
  provider: string;
}

export interface StoryResult {
  title: string;
  story: string;
  slothReflection: string;
  binauralFrequency: number;
  provider: string;
}

export interface SoundChannels {
  rain: number;
  wind: number;
  fire: number;
  binaural: number;
}
