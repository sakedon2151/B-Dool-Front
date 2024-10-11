export interface ParticipantModel {
  participantId: string; 
  channelId: string; 
  favorited: boolean;
  nickname: string;
  joinedAt: string;
  isOnline: boolean;
  profileId: number;
}

export interface ParticipantInsertModel {
  channelId: string;
  nickname: string;
  favorited: boolean;
  joinedAt: string;
}

export interface ParticipantUpdateModel {
  participantId: string; 
  channelId: string;
  nickname: string;
  favorited: boolean;
  joinedAt: string;
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