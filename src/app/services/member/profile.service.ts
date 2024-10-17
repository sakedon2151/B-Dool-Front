import { ProfileInsertModel, ProfileModel, ProfileUpdateModel } from "@/app/models/profile.model";
import { serverAAxios } from "../../utils/axiosInstance";

const BASE_URL = '/profiles';

export const profileService = {

  // ----- queries -----

  // profileId 로 profile 요청
  getProfileById: (profileId: number) => 
    serverAAxios.get<ProfileModel>(`${BASE_URL}/${profileId}`)
  .then(response => response.data),
  
  // memberId 로 profiles 요청
  getProfilesByMemberId: (memberId: number) => 
    serverAAxios.get<ProfileModel[]>(`${BASE_URL}/member/${memberId}`)
      .then(response => response.data),

  // workspaceId 로 profiles 요청
  getProfilesByWorkspaceId: (workspaceId: number) => 
    serverAAxios.get<ProfileModel[]>(`${BASE_URL}/workspace/${workspaceId}`)
      .then(response => response.data),

  // workspaceId 와 memberId 로 profile 요청
  getProfileByMemberIdAndWorkspaceId: (memberId: number, workspaceId: number) =>
    serverAAxios.get<ProfileModel>(`${BASE_URL}/member/${memberId}/workspace/${workspaceId}`)
      .then(response => response.data),

  // ----- mutations -----
  
  // profile 추가 요청
  createProfile: (memberId: number, data: ProfileInsertModel) => 
    serverAAxios.post<ProfileModel>(`${BASE_URL}/${memberId}`, data)
  .then(response => response.data),

  // profile 수정 요청
  updateProfile: (profileId: number, data: ProfileUpdateModel) => 
    serverAAxios.put<ProfileModel>(`${BASE_URL}/${profileId}`, data)
  .then(response => response.data),
  
  // profile 삭제 요청
  deleteProfile: (profileId: number) => 
    serverAAxios.delete(`${BASE_URL}/${profileId}`),
  
  // 초대 profile 추가 요청
  createProfileByInvitation: (memberId: number, workspaceId: number, data: ProfileModel) => 
    serverAAxios.post<ProfileModel>(`${BASE_URL}/${memberId}&&${workspaceId}/invited`, data)
  .then(response => response.data),
  
  // profile status 변경 요청
  updateProfileStatus: (profileId: number, status: string) => 
    serverAAxios.patch<ProfileModel>(`${BASE_URL}/${profileId}/status`, { status })
  .then(response => response.data),
  
  // profile online 변경 요청
  updateProfileOnlineStatus: (profileId: number, isOnline: boolean) => 
    serverAAxios.patch<ProfileModel>(`${BASE_URL}/${profileId}/online?isOnline=${isOnline}`)
  .then(response => response.data),
};