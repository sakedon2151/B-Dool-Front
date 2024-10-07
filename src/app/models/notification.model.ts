type NotificationType = "WORKSPACE_ENTRY" | "CHANNEL_ENTRY" | "CALENDAR_INVITE" | "CHANNEL_MESSAGE" | "SYSTEM_ALERT";
export interface NotificationModel {
  id: number; // 알림 모델 PK
  content: string; // 알림 내용
  createdAt: string; // 생성일시
  readAt: string; // 확인일시
  notificationType: NotificationType;
  profileId: number; // 프로필 ID
  metadata: string;
  expiresAt: string;
}

export const InitialNotification: NotificationModel = {
  id: 0,
  content: "",
  createdAt: "",
  readAt: "",
  notificationType: "SYSTEM_ALERT",
  profileId: 0,
  metadata: "",
  expiresAt: ""
}

// Strict Type Model
