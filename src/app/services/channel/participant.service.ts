import { ParticipantModel } from "@/app/models/participant.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/participant';

export const participantService = {
  
  getParticipantById: (participantId: string) => 
    serverBAxios.get<ParticipantModel>(`${BASE_URL}/${participantId}`)
      .then(response => response.data),

  updateParticipant: (participantId: string, data: ParticipantModel) => 
    serverBAxios.put<ParticipantModel>(`${BASE_URL}/${participantId}`, data)
      .then(response => response.data),

  deleteParticipant: (participantId: string) => 
    serverBAxios.delete(`${BASE_URL}/${participantId}`),

  getAllParticipants: () => 
    serverBAxios.get<ParticipantModel[]>(BASE_URL)
      .then(response => response.data),

  createParticipant: (data: ParticipantModel) => 
    serverBAxios.post<ParticipantModel>(BASE_URL, data)
      .then(response => response.data),

  checkParticipantExists: (participantId: string) => 
    serverBAxios.get<boolean>(`${BASE_URL}/exists/${participantId}`)
      .then(response => response.data),

  getParticipantCount: () => 
    serverBAxios.get<number>(`${BASE_URL}/count`)
      .then(response => response.data)
};