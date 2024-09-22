interface ProfileModel {
    id: number // 프로필 모델 PK
    name: string, // 이름
    nickname: string, // 닉네임
    position: string, // 직책
    status: string, // 상태
    profileImgUrl: string, // 프로필 이미지 URL (파일 서버 생성시 분리)
    isOnline: boolean, // 접속 여부
    isOwner: boolean, // 워크스페이스 소유 여부
    createdAt: Date, // 생성일 (string 고려)
    updatedAt: Date, // 수정일 (string 고려)
    email: string, // 이메일
    workspaceId: number, // 워크스페이스 ID
    memberId: number // 멤버 ID
}