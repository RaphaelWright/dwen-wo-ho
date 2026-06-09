const API_V1 = "/api/v1";

const BASE_URLS = {
  AUTH: `${API_V1}/auth`,
  EMAIL: `${API_V1}/email`,
  SPECIALTIES: `${API_V1}/specialties`,
  PROVIDERS: `${API_V1}/providers`,
  PROVIDER_DASHBOARD: `/api/provider`,
  CURATOR: `${API_V1}/curator`,
  CURATOR_PROVIDERS: `${API_V1}/curator/providers`,
  SCHOOLS: `${API_V1}/schools`,
  PARTNERS: `${API_V1}/partners`,
  LOCKIN: `${API_V1}/lockin`,
  PATIENT_RESULTS: `${API_V1}/patient-results`,
};

export const STATIC_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URLS.AUTH}/sign-in`,
    SIGNUP: `${BASE_URLS.AUTH}/create-account`,
    CHECK_EMAIL: `${BASE_URLS.AUTH}/check-email`,
    VERIFY_EMAIL: `${BASE_URLS.AUTH}/submit-signup-code`,
    ADD_PHOTO: `${BASE_URLS.AUTH}/add-photo`,
    UPDATE_PROFILE: `${BASE_URLS.AUTH}/update-profile`,
    ADD_SPECIALTY: `${BASE_URLS.AUTH}/add-speciality`,
    PROFILE: `${BASE_URLS.AUTH}/profile`,
    RECOVER_ACCOUNT: `${BASE_URLS.AUTH}/recover-account`,
    SUBMIT_ACCOUNT_RECOVERY_CODE: `${BASE_URLS.AUTH}/submit-account-recovery-code`,
    RESET_PASSWORD: `${BASE_URLS.AUTH}/reset-password`,
    REFRESH_TOKEN: `${BASE_URLS.AUTH}/refresh-token`,
    SIGN_OUT: `${BASE_URLS.AUTH}/sign-out`,
  },
  EMAIL: {
    SEND_VERIFICATION: `${BASE_URLS.EMAIL}/send-verification`,
    RESEND_VERIFICATION: `${BASE_URLS.AUTH}/resend-verification`,
  },
  SPECIALTIES: `${BASE_URLS.SPECIALTIES}`,
  CURATOR: {
    SUMMARY: `${BASE_URLS.CURATOR}/summary`,
    NOTIFICATIONS: `${BASE_URLS.CURATOR}/notifications`,
    NOTIFICATIONS_UNREAD: `${BASE_URLS.CURATOR}/notifications/unread`,
    NOTIFICATIONS_READ_ALL: `${BASE_URLS.CURATOR}/notifications/mark-all-read`,
    CLEAR_ALL_NOTIFICATIONS: `${BASE_URLS.CURATOR}/notifications`,
    MARK_NOTIFICATIONS_READ: `${BASE_URLS.CURATOR}/notifications/mark-read`,
    SEND_NOTIFICATION: `${BASE_URLS.CURATOR}/notifications/send`,
  },
  PROVIDERS: {
    BASE: `${BASE_URLS.PROVIDERS}`,
    ACTIVITY: `${BASE_URLS.PROVIDERS}/activity`,
    NOTIFICATIONS: `${BASE_URLS.PROVIDERS}/notifications`,
    NOTIFICATIONS_READ_ALL: `${BASE_URLS.PROVIDERS}/notifications/read-all`,
    SCHOOLS_SUMMARY: `${BASE_URLS.PROVIDERS}/schools/summary`,
  },
  PROVIDER_DASHBOARD: {
    DASHBOARD_INIT: `${BASE_URLS.PROVIDER_DASHBOARD}/dashboard-init`,
    PROFILE: `${BASE_URLS.PROVIDER_DASHBOARD}/profile`,
    AVATAR: `${BASE_URLS.PROVIDER_DASHBOARD}/profile/avatar`,
    PATIENTS: `${BASE_URLS.PROVIDER_DASHBOARD}/patients`,
    PATIENTS_URGENT: `${BASE_URLS.PROVIDER_DASHBOARD}/patients/urgent`,
    NOTIFICATIONS: `${BASE_URLS.PROVIDER_DASHBOARD}/notifications`,
    NOTIFICATIONS_READ_ALL: `${BASE_URLS.PROVIDER_DASHBOARD}/notifications/read-all`,
    CLEAR_ALL_NOTIFICATIONS: `${BASE_URLS.PROVIDER_DASHBOARD}/notifications`,
  },
  SCHOOLS: `${BASE_URLS.SCHOOLS}`,
  SCHOOLS_BATCH: `${BASE_URLS.SCHOOLS}/batch`,
  NEWSLETTER: {
    SUBSCRIBE: `${API_V1}/newsletter/subscribe`,
  },
  LOCKIN: {
    SUBMIT: `${BASE_URLS.LOCKIN}`,
  },
  PATIENT_RESULTS: {
    CREATE: `${BASE_URLS.PATIENT_RESULTS}`,
    BULK_DELETE_PATIENT_RECORDS: `${BASE_URLS.PATIENT_RESULTS}/bulk`,
  },
  PARTNERS: `${BASE_URLS.PARTNERS}`,
};

export const DYNAMIC_ENDPOINTS = {
  CURATOR_PROVIDERS: {
    GET: (providerId: string | number) =>
      `${BASE_URLS.CURATOR_PROVIDERS}/${providerId}`,
  },
  CURATOR: {
    DELETE_NOTIFICATION: (id: string | number) =>
      `${BASE_URLS.CURATOR}/notifications/${id}`,
    MARK_NOTIFICATION_READ: (id: string | number) =>
      `${BASE_URLS.CURATOR}/notifications/${id}/read`,
  },
  PROVIDERS: {
    GET: (email: string) => `${BASE_URLS.PROVIDERS}/${email}`,
    APPROVE: (email: string) => `${BASE_URLS.PROVIDERS}/${email}/approve`,
    REJECT: (email: string) => `${BASE_URLS.PROVIDERS}/${email}/reject`,
    ADD_SCHOOL: (providerId: string | number) =>
      `${BASE_URLS.CURATOR_PROVIDERS}/${providerId}/schools`,
    REMOVE_SCHOOL: (providerId: string | number, schoolId: string | number) =>
      `${BASE_URLS.CURATOR_PROVIDERS}/${providerId}/schools/${schoolId}`,
    UPDATE_PATIENT_STATUS: (patientId: string | number) =>
      `${BASE_URLS.PROVIDER_DASHBOARD}/patients/${patientId}/status`,
    MARK_NOTIFICATION_READ: (id: string | number) =>
      `${BASE_URLS.PROVIDER_DASHBOARD}/notifications/${id}/read`,
    DELETE_NOTIFICATION: (id: string | number) =>
      `${BASE_URLS.PROVIDER_DASHBOARD}/notifications/${id}`,
    PARTNERS: (providerId: string | number) =>
      `${BASE_URLS.PROVIDERS}/${providerId}/partners`,
    ADD_PARTNER: (providerId: string | number, partnerId: string | number) =>
      `${BASE_URLS.PROVIDERS}/${providerId}/add-partner?partnerId=${partnerId}`,
    REMOVE_PARTNER: (providerId: string | number, partnerId: string | number) =>
      `${BASE_URLS.PROVIDERS}/${providerId}/remove-partner?partnerId=${partnerId}`,
  },
  SCHOOLS: {
    GET: (id: string | number) => `${BASE_URLS.SCHOOLS}/${id}`,
    UPDATE: (id: string | number) => `${BASE_URLS.SCHOOLS}/${id}`,
    PARTNERS: (id: string | number) => `${BASE_URLS.SCHOOLS}/${id}/partners`,
    PROVIDERS: (id: string | number) => `${BASE_URLS.SCHOOLS}/${id}/providers`,
    GET_LOCKIN: (id: string | number) => `${BASE_URLS.LOCKIN}/${id}`,
    ADD_PARTNER: (schoolId: string | number, partnerId: string | number) =>
      `${BASE_URLS.SCHOOLS}/${schoolId}/add-partner?partnerId=${partnerId}`,
    REMOVE_PARTNER: (schoolId: string | number, partnerId: string | number) =>
      `${BASE_URLS.SCHOOLS}/${schoolId}/remove-partner?partnerId=${partnerId}`,
    DISABLE: (id: string | number) => `${BASE_URLS.SCHOOLS}/${id}/disable`,
    PATIENTS_OVERVIEW: (id: string | number) =>
      `${BASE_URLS.SCHOOLS}/${id}/patients-overview`,
    ADD_PROVIDER: (schoolId: string | number, providerEmail: string) =>
      `${BASE_URLS.SCHOOLS}/${schoolId}/add-provider?providerEmail=${encodeURIComponent(providerEmail)}`,
    REMOVE_PROVIDER: (schoolId: string | number, providerEmail: string) =>
      `${BASE_URLS.SCHOOLS}/${schoolId}/remove-provider?providerEmail=${encodeURIComponent(providerEmail)}`,
  },
  LOCKIN: {
    GET_UPDATE: (lockinId: string | number) =>
      `${BASE_URLS.LOCKIN}/updates/${lockinId}`,
    UPDATE_COMMENT: (lockinId: string | number) =>
      // NOTE: Use PATCH method, not POST
      `${BASE_URLS.LOCKIN}/updates/${lockinId}/comment`,
    GET_URGENT_CARE: (schoolId: string | number) =>
      `${BASE_URLS.LOCKIN}/urgent-care/${schoolId}`,
    GET_URGENT_CARE_LIGHT: (schoolId: string | number) =>
      `${BASE_URLS.LOCKIN}/urgent-care/light/${schoolId}`,
    GET_URGENT_CARE_TREATING: (schoolId: string | number) =>
      `${BASE_URLS.LOCKIN}/urgent-care/${schoolId}/treating`,
    GET_BENCHMARKS: (schoolType: string) =>
      `${BASE_URLS.LOCKIN}/benchmarks/${encodeURIComponent(schoolType)}`,
  },
  PATIENT_RESULTS: {
    OPEN: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}/open`,
    UPDATE_ACTION_STATUS: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}/action-status`,
    SET_REFERRED_PROVIDER: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}/referred-provider`,
    GET: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}`,
    GET_SCHOOL_RESULTS: (schoolId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/school/${schoolId}`,
    GET_NEW_SCHOOL_RESULTS: (schoolId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/school/${schoolId}/new`,
    GET_PROVIDER_TREATING: (providerId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/provider/${providerId}/treating`,
    AVAILABLE_PROVIDERS_FOR_REFERRAL: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}/available-providers-for-referral`,
    ACTIONS: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}/actions`,
    DELETE_SINGLE_PATIENT_RECORD: (resultId: string | number) =>
      `${BASE_URLS.PATIENT_RESULTS}/${resultId}`,
  },
  PARTNERS: {
    GET: (id: string | number) => `${BASE_URLS.PARTNERS}/${id}`,
    DISABLE: (id: string | number) => `${BASE_URLS.PARTNERS}/${id}/disable`,
    SCHOOLS: (partnerId: string | number) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/schools`,
    PROVIDERS: (partnerId: string | number) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/providers`,
    ADD_SCHOOL: (partnerId: string | number, schoolId: string | number) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/add-school?schoolId=${schoolId}`,
    REMOVE_SCHOOL: (partnerId: string | number, schoolId: string | number) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/remove-school?schoolId=${schoolId}`,
    ADD_PROVIDER: (partnerId: string | number, providerId: string | number) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/add-provider?providerId=${providerId}`,
    REMOVE_PROVIDER: (
      partnerId: string | number,
      providerId: string | number,
    ) =>
      `${BASE_URLS.PARTNERS}/${partnerId}/remove-provider?providerId=${providerId}`,
  },
};

export const PUBLIC_ENDPOINTS = [
  STATIC_ENDPOINTS.AUTH.CHECK_EMAIL,
  STATIC_ENDPOINTS.AUTH.LOGIN,
  STATIC_ENDPOINTS.AUTH.SIGNUP,
  STATIC_ENDPOINTS.AUTH.VERIFY_EMAIL,
  STATIC_ENDPOINTS.EMAIL.SEND_VERIFICATION,
  STATIC_ENDPOINTS.AUTH.RECOVER_ACCOUNT,
  STATIC_ENDPOINTS.AUTH.SUBMIT_ACCOUNT_RECOVERY_CODE,
  STATIC_ENDPOINTS.AUTH.RESET_PASSWORD,
  STATIC_ENDPOINTS.AUTH.REFRESH_TOKEN,
];
