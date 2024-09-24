interface NotificationSettingModel {
    id: number, // 알림 설정 모델 PK
    type: string, // 알림 타입
    enabled: boolean, // 알림 활성화 여부
    profileId: number // 프로필 ID
}