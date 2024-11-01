import { TranslateRequestModel, TranslateResponseModel } from "@/app/models/chatbot.model";
import { serverChatBotAxios } from "@/app/utils/axiosInstance";

const BASE_URL = '/chatbot';

export const chatbotService = {
  translateMessage: (chatbotData: TranslateRequestModel) => 
    serverChatBotAxios.post<TranslateResponseModel>(`${BASE_URL}/translate`, chatbotData)
      .then(response => response.data),
}