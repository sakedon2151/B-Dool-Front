import { PapagoRequestModel, PapagoResponseModel } from "../models/naver.model";
import axios from "axios";

export const naverService = {
  papagoMessage: async (messageData: PapagoRequestModel) => {
    const response = await axios.post<PapagoResponseModel>(
      'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
      messageData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-APIGW-API-KEY-ID': process.env.PAPAGO_CLIENT_ID as string,
          'X-NCP-APIGW-API-KEY': process.env.PAPAGO_CLIENT_SECRET as string
        }
      }
    );
    return response.data;
  }
}