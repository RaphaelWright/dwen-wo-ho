import { AxiosError, AxiosResponse } from "axios";

export const checkResponse = (response: AxiosResponse, statusCode: number) => {
  if (!!response && response.status === statusCode) {
    return response.data;
  }
};

export const checkError = (error: AxiosError): string => {
  const response = error.response as AxiosResponse;
  if (response?.data && response.data?.message) {
    return response?.data?.message;
  }
  return "There was an issue processing your request";
};
