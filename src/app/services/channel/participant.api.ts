import { serverBAxios } from "../axiosInstance";
import { ParticipantModel } from "@/app/models/participant.model";

export const participantService = {

  // GET /api/participant/{participantId}
  getParticipantById: async (participantId: string): Promise<ParticipantModel> => {
    const response = await serverBAxios.get<ParticipantModel>(`/participant/${participantId}`);
    return response.data;
  },

  // PUT /api/participant/{participantId}
  updateParticipant: async (participantId: string, data: ParticipantModel): Promise<ParticipantModel> => {
    const response = await serverBAxios.put<ParticipantModel>(`/participant/${participantId}`, data);
    return response.data;
  },

  // DELETE /api/participant/{participantId}
  deleteParticipant: async (participantId: string): Promise<void> => {
    await serverBAxios.delete(`/participant/${participantId}`);
  },

  // GET /api/participant
  getAllParticipants: async (): Promise<ParticipantModel[]> => {
    const response = await serverBAxios.get<ParticipantModel[]>('/participant');
    return response.data;
  },

  // POST /api/participant
  createParticipant: async (data: ParticipantModel): Promise<ParticipantModel> => {
    const response = await serverBAxios.post<ParticipantModel>('/participant', data);
    return response.data;
  },

  // GET /api/participant/exists/{participantId}
  checkParticipantExists: async (participantId: string): Promise<boolean> => {
    const response = await serverBAxios.get<boolean>(`/participant/exists/${participantId}`);
    return response.data;
  },

  // GET /api/participant/count
  getParticipantCount: async (): Promise<number> => {
    const response = await serverBAxios.get<number>('/participant/count');
    return response.data;
  },
  
}