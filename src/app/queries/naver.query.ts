import { useMutation } from "@tanstack/react-query";
import { PapagoRequestModel, PapagoResponseModel } from "../models/naver.model";
import axios from "axios";

// Query keys
export const CHATBOT_KEYS = {
  all: ["naver"] as const,
  translations: () => [...CHATBOT_KEYS.all, "translations"] as const,
};

// Mutations
export const usePapagoMessage = () => {
  return useMutation({
    mutationFn: (data: PapagoRequestModel) =>
      axios.post<PapagoResponseModel>('/api/papago', data)
        .then(response => response.data)
  });
};