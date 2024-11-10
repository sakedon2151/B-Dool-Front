// profile sse model
export interface ProfileSSENicknameModel {
  profileId: number;
  workspaceId: number;
  nickname: string;
}
export interface ProfileSSEOnlineModel {
  profileId: number;
  workspaceId: number;
  isOnline: boolean;
}

// channel sse model
export interface ChannelSSEAddModel {
  channelId: string;
  channelName: string;
}
export interface ChannelSSERenameModel {
  channelId: string;
  newChannelName: string;
}
export interface ChannelSSEDeleteModel {
  channelId: string;
}

// participant sse model