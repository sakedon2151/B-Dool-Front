import { serverAAxios } from "../axiosInstance";

export const profileService = {
  getAllProfileByWorkspaceId: async (paramData: ProfileListRequest): Promise<ProfileListResponse> => {
    const response = await serverAAxios.get<ProfileListResponse>(`/profiles/workspace/${paramData.workspaceId}`)
    return response.data;
  }
};
