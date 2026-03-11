"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { ROUTES } from "@/lib/constants/routes";
import { calculateTimeAgo } from "@/lib/utils";

export const useProfileStatus = ({
  isInitialPending,
  setUserInfo,
}: {
  isInitialPending?: boolean;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPendingModal, setShowPendingModal] = useState(false);

  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
  });

  // Watch for approval
  useEffect(() => {
    if (
      getProfileQuery.data?.applicationStatus === "APPROVED" ||
      getProfileQuery.data?.applicationStatus === "ACTIVE"
    ) {
      router.push(ROUTES.provider.home);
    }
  }, [getProfileQuery.data, router]);

  useEffect(() => {
    const isPendingParam = searchParams.get("pending") === "true";
    if (isPendingParam || isInitialPending) {
      setShowPendingModal(true);
    }
  }, [searchParams, isInitialPending]);

  // Update modal with fetched profile data
  useEffect(() => {
    if (showPendingModal && getProfileQuery.data) {
      const data = getProfileQuery.data;
      setUserInfo((prev: any) => ({
        ...prev,
        name: `${(data as any).title ? `${(data as any).title} ` : ""}${
          data.providerName || prev.name
        }`,
        title: (data as any).professionalTitle || data.specialty || prev.title,
        specialty: data.specialty || prev.specialty,
        profileImage: data.profilePhotoURL,
        timeAgo: (data as any).applicationDate
          ? calculateTimeAgo((data as any).applicationDate)
          : prev.timeAgo,
      }));
    }
  }, [showPendingModal, getProfileQuery.data, setUserInfo]);

  return {
    showPendingModal,
    setShowPendingModal,
    getProfileQuery,
  };
};
