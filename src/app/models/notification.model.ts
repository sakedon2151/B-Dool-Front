interface NotificationModel {
    id: number, // 알림 모델 PK
    
    content: string, // 알림 내용
    createdAt: Date, // 생성일시
    readAt: Date, // 확인일시
    typeName: string, // 알림 유형
    
    profileId: number // 프로필 ID
}