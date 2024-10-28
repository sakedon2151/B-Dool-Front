import { FileModel } from "./file.model";
import { MessageModel } from "./message.model";
import { ProfileModel } from "./profile.model";

export interface SearchRequest {
  keyword: string;
  profileId: number;
  startDate?: string;
  endDate?: string;
  fileType?: string;
}

export interface UnifiedSearchResponse {
  profiles: ProfileModel[];
  messages: MessageModel[];
  files: FileModel[];
}
