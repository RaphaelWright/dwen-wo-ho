export const ROUTES = {
  public: {
    landing: "/",
    forProviders: "/for-providers",
    about: "/about",
    privacyPolicy: "/privacy-policy",
    termsAndConditions: "/terms-and-conditions",
    cookiePolicy: "/cookie-policy",
  },
  provider: {
    application: "/provider/application",
    singIn: "/provider/auth?step=sign-in",
    signUp: "/provider/signup",
    checkEmail: "/provider/check-email",
    verifyEmail: "/provider/signup",
    verifyPasswordReset: "/provider/auth?step=reset-password",
    newPassword: "/provider/new-password",
    auth: "/provider/auth",
    profile: "/provider/profile",
    home: "/provider",
    schools: "/provider/schools",
    patients: "/provider/patients",
  },
  patient: {
    singIn: "/patient/signin",
    signUp: "/patient/signup",
    checkEmail: "/patient/check-email",
    verifyEmail: "/patient/signup",
    verifyPasswordReset: "/patient/verify-password-reset",
    newPassword: "/patient/new-password",
    lockIn: "/patient/lock-in",
    waitingRoom: "/patient/waiting-room",
  },
  curator: {
    dashboard: "/curator",
    schools: "/curator/schools",
    providers: "/curator/providers",
    partners: "/curator/partners",
    providerDetails: "/curator/provider",
    pages: "/curator/pages",
  },
} as const;

export const DYNAMIC_ROUTES = {
  curator: {
    schoolDetails: (schoolId: string | number) =>
      `/curator/schools/${schoolId}`,
    patientDetails: (schoolId: string | number, patientId: string | number) =>
      `/curator/schools/${schoolId}/patients/${patientId}`,
  },
  provider: {
    schoolDetails: (schoolId: string | number) =>
      `/provider/schools/${schoolId}`,
    patientDetails: (patientId: string | number) =>
      `/provider/patients/${patientId}`,
  },
} as const;
