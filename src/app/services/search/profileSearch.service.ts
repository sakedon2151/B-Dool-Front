import { ProfileModel } from "@/app/models/profile.model";
import { serverCAxios } from "../../utils/axiosInstance";

const BASE_URL = '/search';

export const profileSearchService = {
  searchByName: () => 
    serverCAxios.get<ProfileModel[]>(`${BASE_URL}/name`)
      .then(response => response.data),

  searchByKeyword: (workspaceId: number) => 
    serverCAxios.get<ProfileModel[]>(`${BASE_URL}/${workspaceId}`)
      .then(response => response.data)
};