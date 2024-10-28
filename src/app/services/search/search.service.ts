import { FileModel } from "@/app/models/file.model";
import { MessageModel } from "@/app/models/message.model";
import { ProfileModel } from "@/app/models/profile.model";
import { SearchRequest, UnifiedSearchResponse } from "@/app/models/search.model";
import { serverElasticAxios } from "@/app/utils/axiosInstance";

const BASE_URL = '/search';

export const searchService = {
  // 통합 검색 - 프로필, 메시지, 파일 모두 검색
  unifiedSearch: (workspaceId: number, params: SearchRequest) => 
    serverElasticAxios.get<UnifiedSearchResponse>(
      `${BASE_URL}/unified/${workspaceId}`,
      { params }
    ).then(response => response.data),

  // 프로필만 검색
  searchProfiles: (workspaceId: number, keyword: string) =>
    serverElasticAxios.get<{ profiles: ProfileModel[] }>(
      `${BASE_URL}/profile/${workspaceId}`,
      { params: { keyword } }
    ).then(response => response.data.profiles),

  // 특정 프로필의 메시지 검색
  searchProfileMessages: (profileId: number, keyword: string) =>
    serverElasticAxios.get<{ messages: MessageModel[] }>(
      `${BASE_URL}/messages/${profileId}`,
      { params: { keyword } }
    ).then(response => response.data.messages),

  // 메시지 검색
  searchMessages: (params: SearchRequest) =>
    serverElasticAxios.get<{ messages: MessageModel[] }>(
      `${BASE_URL}/message`,
      { params }
    ).then(response => response.data.messages),

  // 파일 검색
  searchFiles: (params: SearchRequest) =>
    serverElasticAxios.get<{ files: FileModel[] }>(
      `${BASE_URL}/file`,
      { params }
    ).then(response => response.data.files),
};