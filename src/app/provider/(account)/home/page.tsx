"use client";

import PendingVerificationModal from "@/components/modals/pending-verification";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { calculateTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const ProviderHomePage = () => {
    const router = useRouter();
    const [showPendingModal, setShowPendingModal] = useState(false);

    const [hasToken, setHasToken] = useState(false);

    // Reuse the user query logic to get status
    const { getProfileQuery } = useUserQuery({
        refetchInterval: showPendingModal ? 5000 : undefined,
        enabled: hasToken,
    });

    const [userInfo, setUserInfo] = useState({
        name: "Provider",
        title: "Health Provider",
        specialty: "",
        timeAgo: "Recently",
        profileImage: undefined as string | undefined,
    });

    // Protect route and handle pending state from LocalStorage (Fallback)
    useEffect(() => {
        let isMounted = true;
        let hasChecked = false;
        
        const checkAuth = () => {
            if (hasChecked) return;
            hasChecked = true;
            
            const refreshToken = localStorage.getItem("refreshToken");
            const token = localStorage.getItem("token");
            const pendingUserStr = localStorage.getItem("pendingUser");

            // Check if we have any token (refreshToken or token)
            const hasAnyToken = refreshToken || token;

            if (!hasAnyToken && !pendingUserStr) {
                // No tokens and no pending user - redirect to auth
                if (isMounted) {
                    router.replace(`${ROUTES.provider.auth}?step=sign-in`);
                }
                return;
            }

            // If we have any token, enable query (don't redirect even if API fails)
            if (hasAnyToken && isMounted) {
                setHasToken(true);
            }

            // If local storage has pending user data, use it to show modal immediately
            if (pendingUserStr) {
                try {
                    const pendingData = JSON.parse(pendingUserStr);

                    const isPending =
                        pendingData.applicationStatus === "PENDING" ||
                        pendingData.status === "PENDING" ||
                        pendingData.isVerified === false;

                    if (isPending) {
                        setUserInfo({
                            name: `${pendingData.title ? `${pendingData.title} ` : ""}${pendingData.providerName || pendingData.fullName || "Provider"}`,
                            title: pendingData.professionalTitle || pendingData.specialty || "Health Provider",
                            specialty: pendingData.specialty || "",
                            profileImage: pendingData.profilePhotoURL || pendingData.profileURL,
                            timeAgo: pendingData.applicationTimestamp ? calculateTimeAgo(pendingData.applicationTimestamp) : "Recently",
                        });
                        setShowPendingModal(true);
                    }
                } catch (e) {
                    // Ignore parse errors for pending user data
                }
            }
        };
        
        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - router is stable and we only want to check once

    // Update with real data from API if available
    useEffect(() => {
        if (getProfileQuery.data) {
            const data = getProfileQuery.data;

            const isPending =
                data.applicationStatus === "PENDING" ||
                data.status === "PENDING" ||
                (data as any).isVerified === false;

            if (isPending) {
                setUserInfo({
                    name: `${(data as any).title ? `${(data as any).title} ` : ""}${data.providerName || "Provider"}`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: (data as any).professionalTitle || data.specialty || "Health Provider",
                    specialty: data.specialty || "",
                    profileImage: data.profilePhotoURL,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    timeAgo: (data as any).applicationDate ? calculateTimeAgo((data as any).applicationDate) : "Recently",
                });
                setShowPendingModal(true);
            } else {
                setShowPendingModal(false);
                // If verified/approved, clear the pending fallback
                localStorage.removeItem("pendingUser");

                // Check for incomplete profile logic (mirrors signin.tsx)
                const email = data.email || "";
                const emailParams = email ? `email=${encodeURIComponent(email)}&` : "";

                if (!data.profilePhotoURL && !data.profileURL) {
                    router.replace(`/provider/signup?${emailParams}step=photo`);
                    return;
                }

                if (!data.officePhoneNumber && !data.phoneNumber) {
                    router.replace(`/provider/signup?${emailParams}step=bio`);
                    return;
                }

                if ((!data.specialty || !data.specialty.trim()) && (!data.professionalTitle || !data.professionalTitle.trim())) {
                    router.replace(`/provider/signup?${emailParams}step=specialty`);
                    return;
                }
            }
        }
        
        // Handle API errors - don't redirect on auth errors if we have pendingUser
        if (getProfileQuery.error) {
            const error = getProfileQuery.error as any;
            const pendingUserStr = localStorage.getItem("pendingUser");
            if (pendingUserStr && (error?.message?.includes("401") || error?.message?.includes("Invalid"))) {
                try {
                    const pendingData = JSON.parse(pendingUserStr);
                    const isPending = pendingData.applicationStatus === "PENDING" || pendingData.status === "PENDING";
                    if (isPending) {
                        setUserInfo({
                            name: `${pendingData.title ? `${pendingData.title} ` : ""}${pendingData.providerName || pendingData.fullName || "Provider"}`,
                            title: pendingData.professionalTitle || pendingData.specialty || "Health Provider",
                            specialty: pendingData.specialty || "",
                            profileImage: pendingData.profilePhotoURL || pendingData.profileURL,
                            timeAgo: pendingData.applicationTimestamp ? calculateTimeAgo(pendingData.applicationTimestamp) : "Recently",
                        });
                        setShowPendingModal(true);
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }
    }, [getProfileQuery.data, getProfileQuery.error, router]);

    const isApproved = getProfileQuery.data?.applicationStatus === "APPROVED";
    const isLoading = getProfileQuery.isLoading;

    // Redirect approved providers to schools page immediately
    useEffect(() => {
        if (isApproved && !isLoading) {
            router.replace("/provider/schools");
        }
    }, [isApproved, isLoading, router]);

    // Show pending modal if not approved (no "Coming Soon" text)
    if (!isApproved && !isLoading) {
        return (
            <PendingVerificationModal
                isOpen={showPendingModal}
                isLoading={isLoading && !showPendingModal}
                onClose={() => {
                    // Prevent closing to enforce pending state view
                }}
                userInfo={userInfo}
            />
        );
    }

    // Show loading state while checking approval status
    return (
        <div className="h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    );
};

export default ProviderHomePage;
