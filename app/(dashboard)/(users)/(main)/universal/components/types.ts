export interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    badge?: string;
    location?: string;
    isVerified?: boolean;
    country?: string;
  };
  attachment?: string | null;
  documents?: any[];
  lastActive?: string;
  time: string;
  content: string;
  reactions?: { emoji: string; count: number }[];
  replyTo?: Message;
  date: string;
  likeCount?: number;
  Reactions?: {
    ChatId: string;
    TotalReactions: number;
    LikesCount: number;
    EmojiReactions: any[];
    Reactions: any[];
  };
}