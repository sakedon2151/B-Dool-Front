type ChannelType = "DEFAULT" | "CUSTOM" | "DM";
export interface ChannelModel {
  channelId: string; // 채널 모델 PK (UUID)
  workspacesId: number; // 워크스페이스 ID
  name: string; // 채널 이름
  isPrivate: boolean; // 채널 공개 여부
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
  description: string | null; // 채널설명
  profileId: number; // 채널 생성자 프로필 ID
  channelType: ChannelType; // 채널 타입 (ENUM default, custom, dm)
  dmRequestId?: number;
}

export interface ChannelInsertModel {
  workspacesId: number; // 워크스페이스 ID
  name: string; // 채널 이름
  isPrivate: boolean; // 채널 공개 여부
  description: string; // 채널설명
  profileId: number; // 채널 생성자 프로필 ID
  channelType: ChannelType; // 채널 타입 (ENUM default, custom, dm)
  nickname: string; // 채널 최초 생성자 participant용 닉네임
  dmRequestId?: number;
}

export interface ChannelUpdateModel {
  name?: string;
  description?: string;
}

export const InitialChannel: ChannelModel = {
  channelId: "",
  workspacesId: 0,
  name: "",
  isPrivate: false,
  createdAt: "",
  updatedAt: "",
  description: "",
  profileId: 0,
  channelType: "DEFAULT",
  dmRequestId: 0
};