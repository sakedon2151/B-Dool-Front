import { serverAAxios } from "../axiosInstance";

export const profileService = {
  getAllByWorkspaceId: async (workspaceId: number): Promise<ProfileListModel[]> => {
    const response = await serverAAxios.get<ProfileListModel[]>(`/profiles/workspace/${workspaceId}`)
    return response.data;
  },

  // getModalData


};
