"use client";

import { ROUTES } from "@/lib/constants/routes";
import { usePathname, useRouter } from "next/navigation";

export const useHeaderActions = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleGetStarted = () => {
    if (pathname === ROUTES.public.joinAsProvider)
      router.push(ROUTES.provider.auth);
    else router.push(ROUTES.patient.checkEmail);
  };

  return {
    handleGetStarted,
  };
};
