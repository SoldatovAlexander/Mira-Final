export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface PromptData {
  systemPrompt: string;
  baseKnowledge: string;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
}

export interface HtmlState {
  content: string;
  isStreaming: boolean;
}
