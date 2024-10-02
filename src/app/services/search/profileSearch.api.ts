import ProfileModal from "@/app/components/member/ProfileModal";
import { serverCAxios } from "../axiosInstance";
import { ProfileModel } from "@/app/models/profile.model";

export const profileSearchService = {
  
  // GET - /api/search/name
  searchByName: async (): Promise<ProfileModel[]> => {
    const response = await serverCAxios.get<ProfileModel[]>("/search/name");
    return response.data;
  },

  // GET - /api/search/{workspaceId}
  searchByKeyword: async (workspaceId: number): Promise<ProfileModel[]> => {
    const response = await serverCAxios.get<ProfileModel[]>(`/search/${workspaceId}`);
    return response.data;
  },

};
