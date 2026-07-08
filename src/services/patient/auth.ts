import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import type {
  PatientAuthContactType,
  PatientContactCheckResponse,
  PatientForgotPasswordResponse,
  PatientOtpVerifyResponse,
  PatientSendOtpResponse,
  PatientSetPasswordResponse,
  PatientSigninResponse,
  PatientSignupResponse,
} from "@/lib/types/api/auth";

function unwrapPatientAuthResponse<T>(
  response: { success?: boolean; data?: unknown } | null | undefined,
  fallbackMessage: string,
): T {
  if (response?.success && response.data) {
    return response.data as T;
  }

  throw new Error(fallbackMessage);
}

export const patientAuthService = {
  checkContact: async (data: {
    type: PatientAuthContactType;
    value: string;
  }): Promise<PatientContactCheckResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.CHECK_CONTACT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientContactCheckResponse>(
      response,
      "Contact check failed",
    );
  },

  signup: async (data: {
    contactType: PatientAuthContactType;
    contact: string;
    name: string;
    nickname: string;
    gender: string;
    dateOfBirth: string;
    password: string;
  }): Promise<PatientSignupResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientSignupResponse>(
      response,
      "Patient signup failed",
    );
  },

  signin: async (data: {
    contact: string;
    password: string;
  }): Promise<PatientSigninResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.SIGNIN, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientSigninResponse>(
      response,
      "Patient signin failed",
    );
  },

  forgotPassword: async (data: {
    contact: string;
  }): Promise<PatientForgotPasswordResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientForgotPasswordResponse>(
      response,
      "Password recovery failed",
    );
  },

  verifyOtp: async (data: {
    otpReference: string;
    code: string;
  }): Promise<PatientOtpVerifyResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientOtpVerifyResponse>(
      response,
      "OTP verification failed",
    );
  },

  sendOtp: async (data: {
    userId: string;
  }): Promise<PatientSendOtpResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.SEND_OTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientSendOtpResponse>(
      response,
      "Failed to send OTP",
    );
  },

  setPassword: async (data: {
    passwordResetToken: string;
    password: string;
    confirmPassword: string;
  }): Promise<PatientSetPasswordResponse> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_AUTH.SET_PASSWORD, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return unwrapPatientAuthResponse<PatientSetPasswordResponse>(
      response,
      "Failed to set password",
    );
  },

  logout: async (data: { refreshToken: string }): Promise<void> => {
    await api(STATIC_ENDPOINTS.PATIENT_AUTH.LOGOUT, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
