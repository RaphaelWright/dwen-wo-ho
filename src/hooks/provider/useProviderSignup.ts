"use client";

import { useRouter } from "next/navigation";
import useGetSearchParams from "@/hooks/useGetSearchParams";

export function useProviderSignup() {
  const router = useRouter();
  const name = useGetSearchParams("name");
  const title = useGetSearchParams("title");
  const specialty = useGetSearchParams("specialty");
  const photo = useGetSearchParams("photo");
  const pending = useGetSearchParams("pending");
  const email = useGetSearchParams("email");
  const step = useGetSearchParams("step");

  // Map step names to profile step numbers
  const getProfileStep = () => {
    if (step === "photo") return 0;
    if (step === "bio") return 1;
    if (step === "specialty") return 2;
    // If pending, default to profile view (usually effectively step 2 or just rendering the modal over it)
    if (pending === "true") return 2;
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
    isPending: pending === "true",
    profileStep: getProfileStep(),
    handleBack,
  };
}
