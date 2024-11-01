export interface TranslateRequestModel {
  // id?: number;
  // workspacesId?: number;
  // profileId?: number;
  // botResponseId?: number;
  // timestamp?: string;
  // name: string;
  // nickname: string;
  // position: string;
  question: string;
}

export interface TranslateResponseModel {
  answer: string;
}
