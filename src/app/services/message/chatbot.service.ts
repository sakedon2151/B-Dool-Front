import { TranslateRequestModel, TranslateResponseModel } from "@/app/models/chatbot.model";
import { serverBAxios } from "@/app/utils/axiosInstance";

const BASE_URL = '/chatbot';

export const chatbotService = {
  translateMessage: (chatbotData: TranslateRequestModel) => 
    serverBAxios.post<TranslateResponseModel>(`${BASE_URL}/translate`, chatbotData)
      .then(response => response.data),
}