import { ProfileModel } from "@/app/models/profile.model";
import { serverAAxios } from "../../utils/axiosInstance";

const BASE_URL = '/profiles';

export const profileService = {
  getProfileById: (profileId: number) => 
    serverAAxios.get<ProfileModel>(`${BASE_URL}/${profileId}`)
      .then(response => response.data),

  updateProfile: (profileId: number, data: ProfileModel) => 
    serverAAxios.put<ProfileModel>(`${BASE_URL}/${profileId}`, data)
      .then(response => response.data),

  deleteProfile: (profileId: number) => 
    serverAAxios.delete(`${BASE_URL}/${profileId}`),

  createProfile: (memberId: number, data: ProfileModel) => 
    serverAAxios.post<ProfileModel>(`${BASE_URL}/${memberId}`, data)
      .then(response => response.data),

  createInvitedProfile: (memberId: number, workspaceId: number, data: ProfileModel) => 
    serverAAxios.post<ProfileModel>(`${BASE_URL}/${memberId}&&${workspaceId}/invited`, data)
      .then(response => response.data),

  updateProfileStatus: (profileId: number, status: string) => 
    serverAAxios.patch<ProfileModel>(`${BASE_URL}/${profileId}/status`, { status })
      .then(response => response.data),

  updateProfileOnlineStatus: (profileId: number, isOnline: boolean) => 
    serverAAxios.patch<ProfileModel>(`${BASE_URL}/${profileId}/online`, { isOnline })
      .then(response => response.data),

  getProfilesByWorkspaceId: (workspaceId: number) => 
    serverAAxios.get<ProfileModel[]>(`${BASE_URL}/workspace/${workspaceId}`)
      .then(response => response.data),

  getProfilesByMemberId: (memberId: number) => 
    serverAAxios.get<ProfileModel[]>(`${BASE_URL}/member/${memberId}`)
      .then(response => response.data),

  checkProfileExists: (profileId: number) => 
    serverAAxios.get<boolean>(`${BASE_URL}/exists/${profileId}`)
      .then(response => response.data),

  getProfilesCount: () => 
    serverAAxios.get<number>(`${BASE_URL}/count`)
      .then(response => response.data),

  getAllProfiles: () => 
    serverAAxios.get<ProfileModel[]>(BASE_URL)
      .then(response => response.data)
};