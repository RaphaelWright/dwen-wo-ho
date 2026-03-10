import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";

export const authService = {
  login: async (data: { email: string; password: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
    professionalTitle: string;
  }) => {
    return api(STATIC_ENDPOINTS.AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  checkEmail: async (data: { email: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.CHECK_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendVerificationEmail: async (data: { email: string }) => {
    return api(STATIC_ENDPOINTS.EMAIL.SEND_VERIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  recoverAccount: async (data: { email: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.RECOVER_ACCOUNT, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitAccountRecoveryCode: async (data: { code: string; email: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.SUBMIT_ACCOUNT_RECOVERY_CODE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: {
    password: string;
    confirmPassword: string;
    token?: string;
  }) => {
    const headers: Record<string, string> = {};
    if (data.token) {
      headers.Authorization = `Bearer ${data.token}`;
    }

    return api(STATIC_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
      headers,
    });
  },

  addPhoto: async (data: FormData) => {
    const response = await axiosFormData.post(STATIC_ENDPOINTS.AUTH.ADD_PHOTO, data);
    return checkResponse(response, 200);
  },

  updateProfile: async (data: { [key: string]: unknown }) => {
    return api(STATIC_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  addSpecialty: async (data: { specialty: string }) => {
    return api(STATIC_ENDPOINTS.AUTH.ADD_SPECIALTY, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    const response = await api(STATIC_ENDPOINTS.AUTH.PROFILE, { method: "GET" });
    return response.data;
  },
};
