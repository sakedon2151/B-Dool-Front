import { serverBAxios } from "../axiosInstance";

export const channelService = {
  getAllChannelByWorkspaceId: async (paramData: ChannelListRequest): Promise<ChannelListResponse> => {
    const response = await serverBAxios.get<ChannelListResponse>(`/channel/workspaces/${paramData.workspaceId}/channel`)
    return response.data;
  }
};
