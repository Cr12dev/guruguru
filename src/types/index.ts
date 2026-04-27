export interface Message {
  id: string;
  content: string;
  avatar_name: string;
  avatar_type: 'videojuego' | 'coche' | 'actor';
  user_id: string;
  created_at: string;
}

export interface Avatar {
  name: string;
  emoji: string;
  type: 'videojuego' | 'coche' | 'actor';
}

export interface UserAvatar {
  avatar: Avatar;
  uniqueNumber: number;
}
