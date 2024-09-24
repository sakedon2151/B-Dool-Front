// workspace service model

type ChannelType = 'DEFAULT' | 'CUSTOM' | 'DM'

interface ChannelModel {
    id: string, // 채널 모델 PK (UUID)
    workspaceId: number, // 워크스페이스 ID

    name: string, // 채널 이름
    isPrivate: boolean, // 채널 공개 여부
    createdAt: Date, // 생성일시
    updatedAt: Date, // 수정일시
    description: string, // 채널설명

    participantId: number // 채널 생성자 프로필 ID (UUID)
    channelType: ChannelType // 채널 타입 (ENUM default, custom, dm)
}