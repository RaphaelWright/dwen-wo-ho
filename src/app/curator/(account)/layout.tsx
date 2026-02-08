"use client";

import { useRouter, usePathname } from "next/navigation";
import { CuratorSidebar } from "@/components/curator/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import CreateModal from "@/components/curator/ui/create-modal";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MemberCreationModal from "@/components/modals/member-creation";
import PartnerCreationModal from "@/components/modals/partner-creation";
import ReachModal from "@/components/modals/reach";
import { useSchools } from "@/hooks/queries/useSchools";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import SchoolCreationModal from "@/components/modals/school-creation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { performLogout } from "@/lib/auth-utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    }
  }, [router]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showReachModal, setShowReachModal] = useState(false);

  const { schools, isLoading: schoolsLoading } = useSchools();
  const { providers, isLoading: providersLoading } = useProvidersQuery();
  const [partnerCount, setPartnerCount] = useState(0);

  useEffect(() => {
    const loadPartnerCount = async () => {
      try {
        const response = await api(ENDPOINTS.partners);
        if (response?.success && response.data) {
          const partnersList = Array.isArray(response.data)
            ? response.data
            : [];
          setPartnerCount(partnersList.length);
        }
      } catch (error) {
        // Note: Background data loading error, badge will show 0
      }
    };
    loadPartnerCount();
  }, []);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  const schoolCount = Array.isArray(schools) ? schools.length : 0;
  const providerCount =
    providers?.data && Array.isArray(providers.data)
      ? providers.data.length
      : 0;

  // Check if current page is school details page
  const isSchoolDetailPage = pathname?.match(/\/curator\/schools\/\d+$/);

  // Check if current page is patient details page
  const isPatientDetailPage = pathname?.match(
    /\/curator\/schools\/\d+\/patients\/\d+$/,
  );

  // Show loading state only after mount to prevent hydration mismatch
  if (!mounted || isAuthenticated === null) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  // Layout for school details page (no sidebar)
  if (isSchoolDetailPage || isPatientDetailPage) {
    return (
      <div className="h-screen bg-white">
        <div className="h-full overflow-y-auto bg-gray-50">{children}</div>

        {showCreateModal && (
          <CreateModal
            setShowCreateModal={setShowCreateModal}
            onOpenSchoolModal={() => {
              setShowCreateModal(false);
              setShowSchoolModal(true);
            }}
            onOpenMemberModal={() => {
              setShowCreateModal(false);
              setShowMemberModal(true);
            }}
            onOpenPartnerModal={() => {
              setShowCreateModal(false);
              setShowPartnerModal(true);
            }}
            onOpenReachModal={() => {
              setShowCreateModal(false);
              setShowReachModal(true);
            }}
          />
        )}

        <SchoolCreationModal
          isOpen={showSchoolModal}
          onClose={() => {
            setShowSchoolModal(false);
            setShowCreateModal(true);
          }}
          onSchoolCreated={() => {
            setShowSchoolModal(false);
            setShowCreateModal(true);
          }}
        />

        <MemberCreationModal
          isOpen={showMemberModal}
          onClose={() => {
            setShowMemberModal(false);
            setShowCreateModal(true);
          }}
          onMemberCreated={(member) => {
            setShowMemberModal(false);
            setShowCreateModal(true);
          }}
        />

        <PartnerCreationModal
          isOpen={showPartnerModal}
          onClose={() => {
            setShowPartnerModal(false);
            setShowCreateModal(true);
          }}
          onPartnerCreated={async (partner) => {
            try {
              const response = await api(ENDPOINTS.partners);
              if (response?.success && response.data) {
                const partnersList = Array.isArray(response.data)
                  ? response.data
                  : [];
                setPartnerCount(partnersList.length);
              }
            } catch (error) {
              // Note: Background data loading error, badge count may be stale
            }
            setShowPartnerModal(false);
            setShowCreateModal(true);
          }}
        />

        <ReachModal
          isOpen={showReachModal}
          onClose={() => {
            setShowReachModal(false);
            setShowCreateModal(true);
          }}
        />
      </div>
    );
  }

  // Default layout with sidebar
  return (
    <div className="h-screen bg-white flex">
      <CuratorSidebar
        schoolCount={schoolCount}
        providerCount={providerCount}
        partnerCount={partnerCount}
        onCreateClick={() => setShowCreateModal(true)}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        {children}
      </div>

      {showCreateModal && (
        <CreateModal
          setShowCreateModal={setShowCreateModal}
          onOpenSchoolModal={() => {
            setShowCreateModal(false);
            setShowSchoolModal(true);
          }}
          onOpenMemberModal={() => {
            setShowCreateModal(false);
            setShowMemberModal(true);
          }}
          onOpenPartnerModal={() => {
            setShowCreateModal(false);
            setShowPartnerModal(true);
          }}
          onOpenReachModal={() => {
            setShowCreateModal(false);
            setShowReachModal(true);
          }}
        />
      )}

      <SchoolCreationModal
        isOpen={showSchoolModal}
        onClose={() => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
        onSchoolCreated={() => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
      />

      <MemberCreationModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
        onMemberCreated={(member) => {
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
      />

      <PartnerCreationModal
        isOpen={showPartnerModal}
        onClose={() => {
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
        onPartnerCreated={async (partner) => {
          try {
            const response = await api(ENDPOINTS.partners);
            if (response?.success && response.data) {
              const partnersList = Array.isArray(response.data)
                ? response.data
                : [];
              setPartnerCount(partnersList.length);
            }
          } catch (error) {
            // Note: Background data loading error, badge count may be stale
          }
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
      />

      <ReachModal
        isOpen={showReachModal}
        onClose={() => {
          setShowReachModal(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
}
