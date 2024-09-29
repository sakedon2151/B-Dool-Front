type EventScopeType = "WORKSPACE" | "CHANNEL" | "PERSONAL";
export interface EventModel {
  id: number; // event PK
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  scope: EventScopeType;
  createdAt: string;
  updatedAt: string;
  workspaceId: number; // 워크스페이스 이벤트일 경우
  channelId: number; // 채널 이벤트일 경우
  profileId: number; // 해당 이벤트 등록자 ID
}

// Strict Type Model
