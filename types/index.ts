export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}

export type BeaconCategory = 'movie' | 'sports' | 'park' | 'food' | 'other';
export type BeaconType = 'two_person' | 'group';
export type BeaconJoinPolicy = 'open' | 'personal' | 'filtered';

export interface Beacon {
  id: number;
  title: string;
  description: string | null;
  category: BeaconCategory;
  beacon_type: BeaconType;
  join_policy: BeaconJoinPolicy;
  event_time: string;
  creator: {
    id: number;
    name: string | null;
    reliability_score: number;
  };
  joined_count: number;
  max_participants: number;
}
