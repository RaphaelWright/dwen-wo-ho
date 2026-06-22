import { ROUTES } from "./routes";

export const NAV_ITEMS = [
  {
    name: "Patients",
    path: ROUTES.public.landing,
  },
  {
    name: "Providers",
    path: ROUTES.public.joinAsProvider,
  },
] as const;

export const PROVIDER_NOTIFICATION_ACTIONS = {
  OPEN_PATIENT: "OPEN_PATIENT",
  OPEN_SCHOOL_PATIENTS: "OPEN_SCHOOL_PATIENTS",
  OPEN_URGENT_CARE: "OPEN_URGENT_CARE",
  OPEN_PROVIDER_SCHOOL: "OPEN_PROVIDER_SCHOOL",
} as const;

export const VALID_PROVIDER_NOTIFICATION_ACTIONS = Object.values(
  PROVIDER_NOTIFICATION_ACTIONS,
);

export const CURATOR_NOTIFICATION_ACTIONS = {
  OPEN_SCHOOL: "OPEN_SCHOOL",
  OPEN_PROVIDER: "OPEN_PROVIDER",
  OPEN_PATIENT: "OPEN_PATIENT",
  OPEN_PARTNER: "OPEN_PARTNER",
} as const;

export const VALID_CURATOR_NOTIFICATION_ACTIONS = Object.values(
  CURATOR_NOTIFICATION_ACTIONS,
);
