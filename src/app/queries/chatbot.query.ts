import { useMutation } from "@tanstack/react-query";
import { TranslateRequestModel } from "../models/chatbot.model";
import { chatbotService } from "../services/message/chatbot.service";

// Query keys
export const CHATBOT_KEYS = {
  all: ["chatbot"] as const,
  translations: () => [...CHATBOT_KEYS.all, "translations"] as const,
};

// Mutations
export const useTranslateMessage = () => {
  return useMutation({
    mutationFn: (data: TranslateRequestModel) =>
      chatbotService.translateMessage(data),
  });
};
