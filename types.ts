
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  views: string;
  timestamp: string;
  duration: string;
  isAd?: boolean;
  status: 'active' | 'frozen';
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
}
