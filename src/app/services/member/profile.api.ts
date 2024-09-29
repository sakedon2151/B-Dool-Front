import { ProfileModel } from "@/app/models/profile.model";
import { serverAAxios } from "../axiosInstance";

export const profileService = {
  
  // GET /api/profiles/{profileId}
  getProfileById: async (profileId: string): Promise<ProfileModel> => {
    const response = await serverAAxios.get<ProfileModel>(`/profiles/${profileId}`);
    return response.data;
  },

  // PUT /api/profiles/{profileId}
  updateProfile: async (profileId: number, data: ProfileModel): Promise<ProfileModel> => {
    const response = await serverAAxios.put<ProfileModel>(`/profiles/${profileId}`, data);
    return response.data;
  },

  // DELETE /api/profiles/{profileId}
  deleteProfile: async (profileId: string): Promise<void> => {
    await serverAAxios.delete(`/profiles/${profileId}`);
  },

  // POST /api/profiles/{memberId}
  createProfile: async (memberId: number, data: ProfileModel): Promise<ProfileModel> => {
    const response = await serverAAxios.post<ProfileModel>(`/profiles/${memberId}`, data);
    return response.data;
  },

  // POST /api/profiles/{memberId}&&{workspaceId}/invited
  createInvitedProfile: async (memberId: number, workspaceId: number, data: ProfileModel): Promise<ProfileModel> => {
    const response = await serverAAxios.post<ProfileModel>(`/profiles/${memberId}&&${workspaceId}/invited`, data);
    return response.data;
  },

  // PATCH /api/profiles/{profileId}/status
  updateProfileStatus: async (profileId: string, status: string): Promise<ProfileModel> => {
    const response = await serverAAxios.patch<ProfileModel>(`/profiles/${profileId}/status`, { status });
    return response.data;
  },

  // PATCH /api/profiles/{profileId}/online
  updateProfileOnlineStatus: async (profileId: string, isOnline: boolean): Promise<ProfileModel> => {
    const response = await serverAAxios.patch<ProfileModel>(`/profiles/${profileId}/online`, { isOnline });
    return response.data;
  },

  // GET /api/profiles/workspace/{workspaceId}
  getProfilesByWorkspaceId: async (workspaceId: number): Promise<ProfileModel[]> => {
    const response = await serverAAxios.get<ProfileModel[]>(`/profiles/workspace/${workspaceId}`);
    return response.data;
  },

  // GET /api/profiles/exists/{profileId}
  checkProfileExists: async (profileId: string): Promise<boolean> => {
    const response = await serverAAxios.get<boolean>(`/profiles/exists/${profileId}`);
    return response.data;
  },

  // GET /api/profiles/count
  getProfilesCount: async (): Promise<number> => {
    const response = await serverAAxios.get<number>('/profiles/count');
    return response.data;
  },

  // GET /api/profiles/
  getAllProfiles: async (): Promise<ProfileModel[]> => {
    const response = await serverAAxios.get<ProfileModel[]>('/profiles');
    return response.data;
  }

};
