// profile sse model
export interface ProfileSSENicknameModel {
  id: number;
  workspaceId: number;
  nickname: string;
}
export interface ProfileSSEOnlineModel {
  id: number;
  workspaceId: number;
  isOnline: boolean;
}

// channel sse model
export interface ChannelSSEAddModel {
  channelId: string;
  channelName: string;
  workspaceId: number
}
export interface ChannelSSERenameModel {
  channelId: string;
  newChannelName: string;
  workspaceId: number
}
export interface ChannelSSEDeleteModel {
  channelId: string;
  workspaceId: number
}

// participant sse model