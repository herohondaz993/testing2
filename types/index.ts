export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used during registration, not stored
  points: number;
  streak: number;
  lastCheckIn: string | null;
  joinedAt: string;
  isAdmin?: boolean;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: Mood;
  date: string;
  tags: string[];
  analysis?: JournalAnalysis;
  userId: string; // Associate entries with users
}

export type Mood = 'joyful' | 'happy' | 'neutral' | 'sad' | 'stressed';

export interface JournalAnalysis {
  score: number;
  summary: string;
  suggestions: string[];
  keywords: string[];
  appreciation?: string; // Added appreciation message
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  redeemedAt: string;
  code: string;
  userId: string; // Associate redeemed rewards with users
}

export interface AppSettings {
  openAiApiKey: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUserId: string | null;
  isAdmin: boolean;
}