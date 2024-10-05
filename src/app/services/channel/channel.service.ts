import { ChannelModel } from "@/app/models/channel.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/channel';

export const channelService = {
  getAllChannels: () => 
    serverBAxios.get<ChannelModel[]>(BASE_URL)
      .then(response => response.data),

  getChannelsByWorkspaceId: (workspaceId: number) => 
    serverBAxios.get<ChannelModel[]>(`${BASE_URL}/workspaces/${workspaceId}/channel`)
      .then(response => response.data),

  getChannelById: (channelId: number) => 
    serverBAxios.get<ChannelModel>(`${BASE_URL}/${channelId}`)
      .then(response => response.data),

  createChannel: (channelData: ChannelModel) => 
    serverBAxios.post<ChannelModel>(BASE_URL, channelData)
      .then(response => response.data),

  addProfileToChannel: (channelId: string, profileId: string) => 
    serverBAxios.put(`${BASE_URL}/${channelId}/profile/${profileId}`),

  deleteChannel: (channelId: number) => 
    serverBAxios.delete(`${BASE_URL}/${channelId}`),

  checkChannelExists: (channelId: number) => 
    serverBAxios.get<boolean>(`${BASE_URL}/exists/${channelId}`)
      .then(response => response.data),

  getChannelCount: () => 
    serverBAxios.get<number>(`${BASE_URL}/count`)
      .then(response => response.data)
};