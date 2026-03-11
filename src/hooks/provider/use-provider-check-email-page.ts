"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export function useProviderCheckEmailPage() {
  const router = useRouter();

  const handleEmailSubmit = (submittedEmail: string, emailExists: boolean) => {
    const emailParams = encodeURIComponent(submittedEmail);
    if (emailExists) {
      router.push(`${ROUTES.provider.singIn}?email=${emailParams}`);
    } else {
      router.push(`${ROUTES.provider.signUp}?email=${emailParams}`);
    }
  };

  return {
    handleEmailSubmit,
  };
}
