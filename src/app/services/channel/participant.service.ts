import { ParticipantInsertModel, ParticipantModel } from "@/app/models/participant.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/participant';

export const participantService = {
  getAllParticipants: () => 
    serverBAxios.get<ParticipantModel[]>(BASE_URL)
      .then(response => response.data),

  getParticipantsByChannelId: (channelId: string) =>
    serverBAxios.get<ParticipantModel[]>(`${BASE_URL}/${channelId}/channel`)
      .then(response => response.data),

  getParticipantById: (participantId: string) => 
    serverBAxios.get<ParticipantModel>(`${BASE_URL}/${participantId}`)
      .then(response => response.data),

  createParticipant: (data: ParticipantInsertModel) => 
    serverBAxios.post<ParticipantModel>(BASE_URL, data)
      .then(response => response.data),

  updateParticipant: (participantId: string, data: ParticipantModel) => 
    serverBAxios.put<ParticipantModel>(`${BASE_URL}/${participantId}`, data)
      .then(response => response.data),

  deleteParticipant: (participantId: string) => 
    serverBAxios.delete(`${BASE_URL}/${participantId}`),
};