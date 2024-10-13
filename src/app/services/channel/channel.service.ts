import { ChannelInsertModel, ChannelModel } from "@/app/models/channel.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/channel';

export const channelService = {

  // ----- queries -----

  // workspaceId 로 channels 요청
  getChannelsByWorkspaceId: (workspaceId: number) => 
    serverBAxios.get<ChannelModel[]>(`${BASE_URL}/workspaces/${workspaceId}/channel`)
      .then(response => response.data),

  // channelId 로 channel 요청
  getChannelById: (channelId: string) => 
    serverBAxios.get<ChannelModel>(`${BASE_URL}/${channelId}`)
      .then(response => response.data),

  // ----- mutations -----

  // channel 추가 요청
  createChannel: (channelData: ChannelInsertModel) => 
    serverBAxios.post<ChannelModel>(BASE_URL, channelData)
      .then(response => response.data),

  // channel 수정 요청
  updateChannel: (channelId: string, profileId: number) => 
    serverBAxios.put(`${BASE_URL}/${channelId}/profile/${profileId}`),

  // channel 삭제 요청
  deleteChannel: (channelId: string) => 
    serverBAxios.delete(`${BASE_URL}/${channelId}`),

  // getAllChannels: () => 
  //   serverBAxios.get<ChannelModel[]>(BASE_URL)
  //     .then(response => response.data),

  // checkChannelExists: (channelId: number) => 
  //   serverBAxios.get<boolean>(`${BASE_URL}/exists/${channelId}`)
  //     .then(response => response.data),

  // getChannelCount: () => 
  //   serverBAxios.get<number>(`${BASE_URL}/count`)
  //     .then(response => response.data)

};