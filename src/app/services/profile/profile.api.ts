import { serverAAxios } from "../axiosInstance";

export const profileService = {
  getProfileList: async (workspaceId: number): Promise<ProfileListModel[]> => {
    const response = await serverAAxios.get<ProfileListModel[]>(`/profiles/workspace/${workspaceId}`);
    return response.data;
  },

  getProfileModal: async (profileId: number): Promise<ProfileModalModel> => {
    const response = await serverAAxios.get<ProfileModalModel>(`/profiles/${profileId}`);
    return response.data
  },


};
