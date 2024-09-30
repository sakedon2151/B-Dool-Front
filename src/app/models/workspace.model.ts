export interface WorkspaceModel {
  id: number; // 워크스페이스 모델 PK
  name: string; // 워크스페이스 이름
  description: string; // 워크스페이스 설명
  url: string; // 워크스페이스 접근 URL
  workspaceImgUrl: string; // 워크스페이스 이미지 URL (파일 서버 생성시 분리)
  createAt: string; // 생성일시 (string 고려)
  ownerId: number; // 맴버 id
}

// Strict Type Model
// export type WorkspaceListModel = Omit<WorkspaceModel, 'ownerId'>
// export type WorkspaceNavModel = Pick<WorkspaceModel, 'id' | 'name' | 'workspaceImgUrl' >
// export type CreateWorkspaceModel = WorkspaceModel;
// export type UpdateWorkspaceModel = Pick<WorkspaceModel, 'id' | 'name' | 'description' | 'workspaceImgUrl'>
