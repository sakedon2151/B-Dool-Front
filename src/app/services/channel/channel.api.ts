import { ChannelListModel, ChannelModel } from "@/app/models/channel.model";
import { serverBAxios } from "../axiosInstance";

export const channelService = {
  getChannelList: async (workspaceId: number): Promise<ChannelListModel[]> => {
    const response = await serverBAxios.get<ChannelListModel[]>(`/channel/workspaces/${workspaceId}/channel`)
    return response.data;
  },
  
  getChannelByChannelId: async (channelId: string): Promise<ChannelModel> => {
    const response = await serverBAxios.get<ChannelModel>(`/channel/${channelId}`)
    return response.data;
  }
};
