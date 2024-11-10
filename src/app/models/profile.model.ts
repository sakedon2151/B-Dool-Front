export interface ProfileModel {
  id: number; // 프로필 모델 PK
  name: string // 이름
  nickname: string // 닉네임
  position: string // 직책
  status: string | null // 상태
  profileImgUrl: string; // 프로필 이미지 URL (파일 서버 생성시 분리)
  isOnline: boolean; // 접속 여부
  isWorkspaceCreator: boolean; // 워크스페이스 소유 여부
  createdAt: string; // 생성일 
  updatedAt: string; // 수정일
  email: string; // 이메일
  workspaceId: number; // 워크스페이스 ID
  memberId: number; // 멤버 ID
}

export interface ProfileInsertModel {
  name: string;
  nickname: string;
  profileImgUrl: string;
  workspaceId: number;
  position: string
  isWorkspaceCreator: boolean;
}

export interface ProfileUpdateModel {
  nickname?: string;
  name?: string
  position?: string;
  profileImgUrl?: string;
}

export const InitialProfile: ProfileModel = {
  id: 0,
  name: "",
  nickname: "",
  position: "",
  status: "",
  profileImgUrl: "",
  isOnline: false,
  isWorkspaceCreator: false,
  createdAt: "",
  updatedAt: "",
  email: "",
  workspaceId: 0,
  memberId: 0
};