export const ENDPOINTS = {
  // Auth endpoints
  login: "/api/v1/auth/sign-in",
  signup: "/api/v1/auth/create-account",
  checkEmail: "/api/v1/auth/check-email",
  sendVerificationEmail: "/api/v1/email/send-verification",
  verifyEmail: "/api/v1/auth/submit-signup-code",
  addPhoto: "/api/v1/auth/add-photo",
  updateProfile: "/api/v1/auth/update-profile",
  addSpecialty: "/api/v1/auth/add-speciality",
  profile: "/api/v1/auth/profile",
  recoverAccount: "/api/v1/auth/recover-account",
  submitAccountRecoveryCode: "/api/v1/auth/submit-account-recovery-code",
  resetPassword: "/api/v1/auth/reset-password",
  refreshToken: "/api/v1/auth/refresh-token",

  // Specialties endpoints
  specialties: "/api/v1/specialties",

  // Providers endpoints
  providers: "/api/v1/providers",
  provider: (email: string) => `/api/v1/providers/${email}`,
  approveProvider: (email: string) => `/api/v1/providers/${email}/approve`,
  rejectProvider: (email: string) => `/api/v1/providers/${email}/reject`,
  addSchoolToProvider: (schoolId: string | number, providerEmail: string) => `/api/v1/schools/${schoolId}/add-provider?providerEmail=${providerEmail}`,
  removeSchoolFromProvider: (schoolId: string | number, providerEmail: string) => `/api/v1/schools/${schoolId}/remove-provider?providerEmail=${providerEmail}`,
  addPartnerToProvider: (partnerId: string | number, providerId: string | number) => `/api/v1/partners/${partnerId}/add-provider?providerId=${providerId}`,
  removePartnerFromProvider: (partnerId: string | number, providerId: string | number) => `/api/v1/partners/${partnerId}/remove-provider?providerId=${providerId}`,

  // Schools endpoints
  schools: "/api/v1/schools",
  school: (id: string | number) => `/api/v1/schools/${id}`,
  updateSchool: (id: string | number) => `/api/v1/schools/${id}?schoolId=${id}`,
  schoolPartners: (id: string | number) => `/api/v1/schools/${id}/partners`,
  schoolProviders: (id: string | number) => `/api/v1/schools/${id}/providers`,
  schoolReach: (id: string | number) => `/api/v1/schools/${id}/reach`,
  getSchoolLockIn: (id: string) => `/api/v1/lockin/${id}`,
  disableSchool: (id: string | number) => `/api/v1/schools/${id}/disable`,

  // Partners endpoints
  partners: "/api/v1/partners",
  partner: (id: string | number) => `/api/v1/partners/${id}`,
  disablePartner: (id: string | number) => `/api/v1/partners/${id}/disable`,
  addPartnerToSchool: (schoolId: string | number, partnerId: string | number) => `/api/v1/schools/${schoolId}/add-partner?partnerId=${partnerId}`,
  removePartnerFromSchool: (schoolId: string | number, partnerId: string | number) => `/api/v1/schools/${schoolId}/remove-partner?partnerId=${partnerId}`,
  partnerSchools: (partnerId: string | number) => `/api/v1/partners/${partnerId}/schools`,
  partnerProviders: (partnerId: string | number) => `/api/v1/partners/${partnerId}/providers`,
  addSchoolToPartner: (partnerId: string | number, schoolId: string | number) => `/api/v1/partners/${partnerId}/add-school?schoolId=${schoolId}`,
  removeSchoolFromPartner: (partnerId: string | number, schoolId: string | number) => `/api/v1/partners/${partnerId}/remove-school?schoolId=${schoolId}`,
  addProviderToPartner: (partnerId: string | number, providerId: string | number) => `/api/v1/partners/${partnerId}/add-provider?providerId=${providerId}`,
  removeProviderFromPartner: (partnerId: string | number, providerId: string | number) => `/api/v1/partners/${partnerId}/remove-provider?providerId=${providerId}`,
};
