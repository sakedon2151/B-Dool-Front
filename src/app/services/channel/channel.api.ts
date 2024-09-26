import { serverBAxios } from "../axiosInstance";

export const channelService = {
  getAllByWorkspaceId: async (workspaceId: number): Promise<ChannelListModel[]> => {
    const response = await serverBAxios.get<ChannelListModel[]>(`/channel/workspaces/${workspaceId}/channel`)
    return response.data;
  },
  getOneByChannelId: async (channelId: string): Promise<ChannelModel> => {
    const response = await serverBAxios.get<ChannelModel>(`/channel/${channelId}`)
    return response.data;
  }
};
