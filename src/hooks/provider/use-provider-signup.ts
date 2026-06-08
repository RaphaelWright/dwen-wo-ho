"use client";

import { useRouter } from "next/navigation";
import useGetSearchParams from "@/hooks/use-get-search-params";

export function useProviderSignup() {
  const router = useRouter();
  const name = useGetSearchParams("name");
  const title = useGetSearchParams("title");
  const specialty = useGetSearchParams("specialty");
  const photo = useGetSearchParams("photo");
  const email = useGetSearchParams("email");
  const step = useGetSearchParams("step");

  const getProfileStep = () => {
    if (step === "photo") return 0;
    if (step === "bio") return 1;
    if (step === "specialty") return 2;
    return null;
  };

  const handleBack = () => {
    router.back();
  };

  return {
    email: email ?? undefined,
    fullName: name ?? undefined,
    title: title ?? undefined,
    specialty: specialty ?? undefined,
    profileImage: photo ?? undefined,
    profileStep: getProfileStep(),
    handleBack,
  };
}
