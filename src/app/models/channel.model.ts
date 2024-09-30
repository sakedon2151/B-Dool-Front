type ChannelType = "DEFAULT" | "CUSTOM" | "DM";
export interface ChannelModel {
  channelId: string; // 채널 모델 PK (UUID)
  workspacesId: number; // 워크스페이스 ID
  name: string; // 채널 이름
  isPrivate: boolean; // 채널 공개 여부
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
  description: string; // 채널설명
  profileId: string; // 채널 생성자 프로필 ID (UUID)
  channelType: ChannelType; // 채널 타입 (ENUM default, custom, dm)
}

export const InitialChannel: ChannelModel = { // 추후 워크스페이스 입장시 파라미터 넣어서 초기 general channel 넣기 
  channelId: "",
  workspacesId: 0,
  name: "General Channel",
  isPrivate: false,
  createdAt: "",
  updatedAt: "",
  description: "",
  profileId: "",
  channelType: "DEFAULT"
};

// Strict Type Model
// export type ChannelStoreModel = ChannelModel;
// export type ChannelListModel = Pick<ChannelModel, 'channelId' | 'name' | 'isPrivate' | 'channelType'> 

