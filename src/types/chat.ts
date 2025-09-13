export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
  liked?: boolean;
  disliked?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface QuickReply {
  id: string;
  text: string;
  category: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  createNewChat: () => void;
  switchToChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
}