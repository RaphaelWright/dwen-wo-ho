import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  ProviderDashboardInitResponse,
  ProviderUpdateProfileRequest,
  ProviderUpdatePatientStatusRequest,
  ProviderPatientsParams,
  ProviderProfileData,
} from "@/lib/types/api/provider-dashboard";
import type {
  PatientListResponse,
  UrgentPatientListResponse,
} from "@/lib/types/api/patient-results";
import { ProviderNotificationListResponse } from "@/lib/types/notification";

const PD = STATIC_ENDPOINTS.PROVIDER_DASHBOARD;

export const providerDashboardService = {
  getDashboardInit: async (): Promise<ProviderDashboardInitResponse> => {
    const result = await api(PD.DASHBOARD_INIT);
    if (result?.success && result.data)
      return result.data as ProviderDashboardInitResponse;
    throw new Error("Failed to fetch provider dashboard");
  },

  getProfile: async (): Promise<ProviderProfileData> => {
    const result = await api(PD.PROFILE);
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to fetch provider profile");
  },

  updateProfile: async (
    payload: ProviderUpdateProfileRequest,
  ): Promise<ProviderProfileData> => {
    const result = await api(PD.PROFILE, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to update provider profile");
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api(STATIC_ENDPOINTS.AUTH.ADD_PHOTO, {
      method: "POST",
      body: formData,
    });

    const data = response?.data as
      | { profilePhotoUrl?: string; avatarUrl?: string }
      | undefined;

    return (data?.profilePhotoUrl ?? data?.avatarUrl) as unknown as {
      avatarUrl: string;
    };
  },

  getPatients: async (
    params?: ProviderPatientsParams,
  ): Promise<PatientListResponse> => {
    const query = new URLSearchParams();
    if (params?.schoolId) query.set("schoolId", params.schoolId);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page != null) query.set("page", String(params.page));
    if (params?.limit != null) query.set("limit", String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : "";
    const result = await api(`${PD.PATIENTS}${qs}`);
    if (result?.success && result.data)
      return result.data as PatientListResponse;
    throw new Error("Failed to fetch provider patients");
  },

  getUrgentPatients: async (): Promise<UrgentPatientListResponse> => {
    const result = await api(PD.PATIENTS_URGENT);
    if (result?.success && result.data) return result.data;
    throw new Error("Failed to fetch urgent patients");
  },

  updatePatientStatus: async (
    patientId: string | number,
    payload: ProviderUpdatePatientStatusRequest,
  ): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.UPDATE_PATIENT_STATUS(patientId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  getNotifications: async (
    page?: number,
  ): Promise<ProviderNotificationListResponse> => {
    const qs = page != null ? `?page=${page}` : "";
    const result = await api(`${PD.NOTIFICATIONS}${qs}`);
    if (result?.success && result.data) {
      return result.data as ProviderNotificationListResponse;
    }
    return {
      items: [],
      unreadCount: 0,
      totalCount: 0,
    };
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await api(PD.NOTIFICATIONS_READ_ALL, { method: "POST" });
  },

  markOneNotificationRead: async (id: string): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.MARK_NOTIFICATION_READ(id), {
      method: "PATCH",
    });
  },

  deleteNotification: async (id: string | number): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.DELETE_NOTIFICATION(id), {
      method: "DELETE",
    });
  },

  clearAllNotifications: async (): Promise<void> => {
    await api(PD.CLEAR_ALL_NOTIFICATIONS, { method: "DELETE" });
  },

  updatePhoneNumber: async (payload: {
    officePhoneNumber: string;
    status: string;
  }): Promise<ProviderProfileData> => {
    // Format phone to international standard (+233 XX XXX XXXX)
    let phone = payload.officePhoneNumber.trim();
    // Remove all non-digit characters except leading +
    const hasPlus = phone.startsWith("+");
    phone = phone.replace(/\D/g, "");
    if (hasPlus) phone = "+" + phone;

    // Convert local Ghana number (024... -> +23324...)
    if (phone.startsWith("0") && phone.length === 10) {
      phone = "+233" + phone.substring(1);
    }
    // Convert 00233... to +233...
    if (phone.startsWith("00233")) {
      phone = "+233" + phone.substring(5);
    }

    const result = await api(STATIC_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: "POST",
      body: JSON.stringify({
        officePhoneNumber: phone,
        status: payload.status,
      }),
    });
    if (result?.success && result.data)
      return result.data as ProviderProfileData;
    throw new Error("Failed to update provider profile");
  },
};
