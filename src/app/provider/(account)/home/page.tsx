"use client";

import JustGoHealth from "@/components/logo-purple";
import PendingVerificationModal from "@/components/modals/pending-verification";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { calculateTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import WidthConstraint from "@/components/ui/width-constraint";

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
                    console.error("HOME PAGE: Failed to parse pending user data", e);
                }
            }
        };
        
        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, [router]);

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

    // Show pending modal and coming soon if not approved
    if (!isApproved && !isLoading) {
        return (
            <>
                <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                    <div className="text-center space-y-6 max-w-2xl px-6">
                        <div className="flex justify-center mb-8">
                            <JustGoHealth />
                        </div>

                        <h1 className="text-5xl font-extrabold text-[#955aa4] tracking-tight">
                            Coming Soon
                        </h1>

                        <p className="text-xl text-gray-600 font-medium leading-relaxed">
                            We are working hard to build your provider dashboard. <br />
                            Stay tuned for updates!
                        </p>

                        <div className="w-24 h-1 bg-[#2bb673] mx-auto rounded-full my-8"></div>
                    </div>
                </main>

                <PendingVerificationModal
                    isOpen={showPendingModal}
                    isLoading={isLoading && !showPendingModal}
                    onClose={() => {
                        // Prevent closing to enforce pending state view
                    }}
                    userInfo={userInfo}
                />
            </>
        );
    }

    // Show actual content when approved - redirect to schools page
    useEffect(() => {
        if (isApproved && !isLoading) {
            router.replace("/provider/schools");
        }
    }, [isApproved, isLoading, router]);

    return (
        <WidthConstraint>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back!</p>
                </div>
            </div>
        </WidthConstraint>
    );
};

export default ProviderHomePage;
