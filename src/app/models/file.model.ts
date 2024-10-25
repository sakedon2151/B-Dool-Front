type EntityType = 'MESSAGE' | 'PROFILE' | 'WORKSPACE';
type FileType = 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER'
type StatusType = 'ACTIVE' | 'DELETED' | 'ARCHIVED';

export interface FileModel {
  fileId: string; // 파일 uuid pk
  fName: string; // 파일 이름
  originalFileName: string
  path: string; // 파일 경로
  size: number; // 파일 크기
  extension: string; // 파일 확장자
  uploadedAt: string;
  entityType: EntityType;  
  entityId: string
  fileType: FileType
  md5Hash: string
  status: StatusType
}

export interface FileUploadModel {
  entityType: EntityType; // 파일 
  entityId: string
  // + 인풋으로 포함시킨 파일과 함께 전송
}

export const InitialFile: FileModel = {
  fileId: "",
  fName: "",
  originalFileName: "",
  path: "",
  size: 0,
  extension: "",
  uploadedAt: "",
  entityType: "MESSAGE",
  entityId: "",
  fileType: "IMAGE",
  md5Hash: "",
  status: "ACTIVE"
}