export interface ParticipantModel {
  participantId: string; 
  channelId: string; 
  nickname: string;
  joinedAt: string;
  isOnline: boolean;
  profileId: number;
  profileUrl: string;
}

export interface ParticipantInsertModel {
  channelId: string;
  nickname: string;
  profileUrl: string;
  profileId: number;
}

export interface ParticipantUpdateModel {
  nickname?: string;
  isOnline?: boolean;
  profileUrl?: string;
}

export const InitialParticipant: ParticipantModel = {
  participantId: "",
  channelId: "",
  nickname: "",
  joinedAt: "",
  isOnline: false,
  profileId: 0,
  profileUrl: ""
}