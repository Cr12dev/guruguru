export interface Message {
  id: string;
  content: string;
  avatar_name: string;
  avatar_type: 'videojuego' | 'coche' | 'actor';
  user_id: string;
  created_at: string;
  is_pinned: boolean;
  updated_at: string | null;
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

export interface UserPresence {
  user_id: string;
  online: boolean;
  last_seen: string;
}
