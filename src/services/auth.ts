import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import {
  SignInResponse,
  CheckEmailResponse,
  TokenResponse,
  AddPhotoResponse,
  ProviderProfileResponse,
} from "@/lib/types/api/auth";

/**
 * NOTE: Curator and Provider share authentication endpoints.
 * Both use POST /api/v1/auth/sign-in and POST /api/v1/auth/create-account.
 * Role is distinguished client-side by userData.userRole === "ROLE_CURATOR".
 * This is intentional per backend design — no separate curator auth routes exist.
 */
export const authService = {
  login: async (data: {
    email: string;
    password: string;
  }): Promise<SignInResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as SignInResponse;
    }
    throw new Error("Login failed");
  },

  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
    professionalTitle: string;
  }): Promise<SignInResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as SignInResponse;
    }
    throw new Error("Signup failed");
  },

  checkEmail: async (data: { email: string }): Promise<CheckEmailResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.CHECK_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as CheckEmailResponse;
    }
    throw new Error("Check email failed");
  },

  verifyEmail: async (data: {
    email: string;
    code: string;
  }): Promise<TokenResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as TokenResponse;
    }
    throw new Error("Email verification failed");
  },

  sendVerificationEmail: async (data: { email: string }): Promise<void> => {
    const response = await api(STATIC_ENDPOINTS.EMAIL.SEND_VERIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response?.success)
      throw new Error("Failed to send verification email");
  },


  resendVerificationEmail: async (data: { email: string }): Promise<void> => {
    const response = await api(STATIC_ENDPOINTS.EMAIL.RESEND_VERIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response?.success)
      throw new Error("Failed to resend verification email");
  },


  recoverAccount: async (data: { email: string }): Promise<void> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.RECOVER_ACCOUNT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response?.success) throw new Error("Failed to recover account");
  },

  submitAccountRecoveryCode: async (data: {
    code: string;
    email: string;
  }): Promise<TokenResponse> => {
    const response = await api(
      STATIC_ENDPOINTS.AUTH.SUBMIT_ACCOUNT_RECOVERY_CODE,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    if (response?.success && response.data) {
      return response.data as TokenResponse;
    }
    throw new Error("Account recovery failed");
  },

  resetPassword: async (data: {
    password: string;
    confirmPassword: string;
    token?: string;
  }): Promise<void> => {
    const headers: Record<string, string> = {};
    if (data.token) {
      headers.Authorization = `Bearer ${data.token}`;
    }

    const response = await api(STATIC_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
      headers,
    });
    if (!response?.success) throw new Error("Failed to reset password");
  },

  addPhoto: async (data: FormData): Promise<AddPhotoResponse> => {
    const response = await axiosFormData.post(
      STATIC_ENDPOINTS.AUTH.ADD_PHOTO,
      data,
    );
    return checkResponse(response, 200) as AddPhotoResponse;
  },

  updateProfile: async (data: {
    [key: string]: unknown;
  }): Promise<ProviderProfileResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as ProviderProfileResponse;
    }
    throw new Error("Failed to update profile");
  },

  addSpecialty: async (data: { specialty: string }): Promise<void> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.ADD_SPECIALTY, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response?.success) throw new Error("Failed to add specialty");
  },

  getProfile: async (): Promise<ProviderProfileResponse> => {
    const response = await api(STATIC_ENDPOINTS.AUTH.PROFILE, {
      method: "GET",
    });
    if (response?.success && response.data) {
      return response.data as ProviderProfileResponse;
    }
    throw new Error("Failed to get profile");
  },

  // T3-10: Sign out from backend
  signOut: async (): Promise<void> => {
    try {
      await api(STATIC_ENDPOINTS.AUTH.SIGN_OUT, { method: "POST" });
    } catch (error) {
      // Silently handle error — local logout should still proceed
      console.error("Backend sign-out failed:", error);
    }
  },
};
