interface WorkspaceModel {
    id: number, // 워크스페이스 모델 PK
    
    name: string, // 워크스페이스 이름
    description: string, // 워크스페이스 설명
    url: string, // 워크스페이스 접근 URL ?
    workspaceImgUrl: string, // 워크스페이스 이미지 URL (파일 서버 생성시 분리)
    createAt: Date, // 생성일시 (string 고려)
    
    memberId: number // 맴버 ID
}