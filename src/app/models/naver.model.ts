export interface PapagoRequestModel {
  source: string
  target: string
  text: string
}

export interface PapagoResponseModel {
  message: {
    result: {
      srcLangType: string;
      tarLangType: string;
      translatedText: string;
    }
  }
}