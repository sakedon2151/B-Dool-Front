type EntityType = 'MESSAGE' | 'PROFILE' | 'CHANNEL' | 'WORKSPACE';

export interface FileModel {
  fileId: string; // 파일 uuid pk
  fName: string; // 파일 이름
  path: string; // 파일 경로
  size: number; // 파일 크기
  extension: string; // 파일 확장자
  uploadedAt: string;
  profileId: string; // uuid
  channelId: string; // uuid
  workspaceId: string; // uuid
  entityType: EntityType;
}

export interface FileUploadModel {
  file: File;
  profileId: string;
  channelId: string;
  workspaceId: string;
}

// Strict Type Model
