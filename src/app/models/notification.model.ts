// fullModel
interface NotificationModel {
  id: number; // 알림 모델 PK
  content: string; // 알림 내용
  createdAt: string; // 생성일시
  readAt: string; // 확인일시
  typeName: string; // 알림 유형 (메시지, 캘린더, 시스템)
  profileId: number; // 프로필 ID
}
