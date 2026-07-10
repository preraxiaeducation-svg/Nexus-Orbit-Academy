export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  sendMessage: (content: string) => Promise<void>;
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
}

export interface QuickAction {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  color: "blue" | "purple" | "cyan" | "orange";
}
