import { api } from "@/lib/api";
import { axiosFormData } from "@/configs/axiosInstance";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  DashboardInitResponse,
  UpdateProfileRequest,
  UpdatePatientStatusRequest,
  ProviderPatientsParams,
  ProfileData,
  NotificationsData,
} from "@/lib/types/api/provider-dashboard";
import type { PatientListResponse } from "@/lib/types/api/patient-results";

const PD = STATIC_ENDPOINTS.PROVIDER_DASHBOARD;

export const providerDashboardService = {
  getDashboardInit: async (): Promise<DashboardInitResponse> => {
    const result = await api(PD.DASHBOARD_INIT);
    if (result?.success && result.data)
      return result.data as DashboardInitResponse;
    throw new Error("Failed to fetch provider dashboard");
  },

  getProfile: async (): Promise<ProfileData> => {
    const result = await api(PD.PROFILE);
    if (result?.success && result.data) return result.data as ProfileData;
    throw new Error("Failed to fetch provider profile");
  },

  updateProfile: async (
    payload: UpdateProfileRequest,
  ): Promise<ProfileData> => {
    const result = await api(PD.PROFILE, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (result?.success && result.data) return result.data as ProfileData;
    throw new Error("Failed to update provider profile");
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axiosFormData.post(PD.AVATAR, formData);
    return response.data?.data ?? response.data;
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

  getUrgentPatients: async (): Promise<PatientListResponse> => {
    const result = await api(PD.PATIENTS_URGENT);
    if (result?.success && result.data)
      return result.data as PatientListResponse;
    throw new Error("Failed to fetch urgent patients");
  },

  updatePatientStatus: async (
    patientId: string | number,
    payload: UpdatePatientStatusRequest,
  ): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.UPDATE_PATIENT_STATUS(patientId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  getNotifications: async (page?: number) => {
    const qs = page != null ? `?page=${page}` : "";
    const result = await api(`${PD.NOTIFICATIONS}${qs}`);
    if (result?.success && result.data) {
      const data = result.data as NotificationsData;
      // Normalize shape to match NotificationListResponse
      // (the websocket hook and other consumers expect `.notifications`)
      return {
        notifications: data.items ?? [],
        unreadCount: data.unreadCount ?? 0,
        totalCount: data.items?.length ?? 0,
      };
    }
    return { notifications: [], unreadCount: 0, totalCount: 0 };
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
};
