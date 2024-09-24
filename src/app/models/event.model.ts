// calender service model

type EventScope = 'WORKSPACE' | 'CHANNEL' | 'PERSONAL'

interface EventModel {
  id: number // event PK
  
  title: string
  description: string
  startTime: Date
  endTime: Date
  scope: EventScope
  createdAt: Date
  updatedAt: Date

  workspaceId: number // 워크스페이스 이벤트일 경우
  channelId: number // 채널 이벤트일 경우
  profileId: number // 해당 이벤트 등록자 ID
}
