export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  settings: ChatSettings;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
} 