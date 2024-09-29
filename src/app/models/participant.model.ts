export interface ParticipantModel {
  participantId: string; // mongodb uuid pk
  channelId: string; // uuid 
  favorited: boolean;
  profileName: string;
  joinedAt: string;
}

// Strict Type Model
