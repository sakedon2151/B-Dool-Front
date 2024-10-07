type EntityType = 'MESSAGE' | 'PROFILE' | 'CHANNEL' | 'WORKSPACE';
export interface FileModel {
  fileId: string; // 파일 uuid pk
  fName: string; // 파일 이름
  path: string; // 파일 경로
  size: number; // 파일 크기
  extension: string; // 파일 확장자
  uploadedAt: string;
  profileImgId: number;
  channelImgId: string;
  messageImgId: string;
  entityType: EntityType;
}

export const InitialFile: FileModel = {
  fileId: "",
  fName: "",
  path: "",
  size: 0,
  extension: "",
  uploadedAt: "",
  profileImgId: 0,
  channelImgId: "",
  messageImgId: "",
  entityType: "MESSAGE"
}

// Strict Type Model
