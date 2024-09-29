import { ChannelModel } from "@/app/models/channel.model";
import { serverBAxios } from "../axiosInstance";

export const channelService = {
  
  // GET /api/channel
  getAllChannels: async (): Promise<ChannelModel[]> => {
    const response = await serverBAxios.get<ChannelModel[]>('/channel');
    return response.data;
  },

  // GET /api/channel/workspaces/{workspaceId}/channel
  getChannelsByWorkspaceId: async (workspaceId: number): Promise<ChannelModel[]> => {
    const response = await serverBAxios.get<ChannelModel[]>(`/channel/workspaces/${workspaceId}/channel`);
    return response.data;
  },

  // GET /api/channel/{channelId}
  getChannelById: async (channelId: number): Promise<ChannelModel> => {
    const response = await serverBAxios.get<ChannelModel>(`/channel/${channelId}`);
    return response.data;
  },

  // POST /api/channel
  createChannel: async (channelData: ChannelModel): Promise<ChannelModel> => {
    const response = await serverBAxios.post<ChannelModel>('/channel', channelData);
    return response.data;
  },

  // PUT /api/channel/{channelId}/profile/{profileId}
  addProfileToChannel: async (channelId: string, profileId: string): Promise<void> => {
    await serverBAxios.put(`/channel/${channelId}/profile/${profileId}`);
  },

  // DELETE /api/channel/{channelId}
  deleteChannel: async (channelId: number): Promise<void> => {
    await serverBAxios.delete(`/channel/${channelId}`);
  },

  // GET /api/channel/exists/{channelId}
  checkChannelExists: async (channelId: number): Promise<boolean> => {
    const response = await serverBAxios.get<boolean>(`/channel/exists/${channelId}`);
    return response.data;
  },

  // GET /api/channel/count
  getChannelCount: async (): Promise<number> => {
    const response = await serverBAxios.get<number>('/channel/count');
    return response.data;
  },

};
