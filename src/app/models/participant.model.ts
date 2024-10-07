export interface ParticipantModel {
  participantId: string; 
  channelId: string; 
  favorited: boolean;
  nickname: string;
  joinedAt: string;
  isOnline: boolean;
  profileId: number;
}

export const InitialParticipant: ParticipantModel = {
  participantId: "",
  channelId: "",
  favorited: false,
  nickname: "",
  joinedAt: "",
  isOnline: false,
  profileId: 0
}

// Strict Type Model
