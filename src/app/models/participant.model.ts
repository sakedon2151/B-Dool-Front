export interface ParticipantModel {
  participantId: string; 
  channelId: string; 
  nickname: string;
  joinedAt: string;
  isOnline: boolean;
  profileId: number;
  profileURL: string;
}

export interface ParticipantInsertModel {
  channelId: string;
  nickname: string;
  profileURL: string;
  profileId: number;
}

export interface ParticipantUpdateModel {
  participantId: string; 
  channelId: string;
  nickname: string;
  joinedAt: string;
}

export const InitialParticipant: ParticipantModel = {
  participantId: "",
  channelId: "",
  nickname: "",
  joinedAt: "",
  isOnline: false,
  profileId: 0,
  profileURL: ""
}