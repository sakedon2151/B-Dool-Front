export interface ParticipantModel {
  participantId: string; // mongodb uuid pk
  channelId: string; // uuid 
  favorited: boolean;
  nickname: string;
  isOnline: string;
  joinedAt: string;
  profileId: number;
}

// Strict Type Model
