export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { ROUTES } from "./routes";

export const NAV_ITEMS = [
  {
    name: "Patients",
    path: ROUTES.public.landing,
  },
  {
    name: "Providers",
    path: ROUTES.public.forProviders,
  },
] as const;
