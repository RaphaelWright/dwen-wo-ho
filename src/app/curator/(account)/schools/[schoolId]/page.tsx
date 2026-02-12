"use client";

import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import AddIconModal from "@/components/modals/add-icon";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ProvidersTab } from "@/features/curator/components/school-detail-tabs";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";
import { ROUTES } from "@/lib/constants/routes";
import { ProviderDetails } from "@/types/provider";
import { useCuratorSchoolDetails } from "@/hooks/curator/useCuratorSchoolDetails";
import {
  SchoolHeaderCard,
  SchoolTabNavigation,
  PatientsTab,
  IconsTab,
  UrgentCareSidebar,
} from "@/features/curator/components/school-details";

export default function SchoolDetailsPage() {
  const {
    router,
    schoolId,
    school,
    patients,
    providers,
    icons: schoolIcons,
    urgentCare,
    campusLabel,
    isLoading,
    patientsLoading,
    providersLoading,
    urgentLoading,
    isActionLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showAddIconModal,
    setShowAddIconModal,
    editingIcon,
    setEditingIcon,
    handleProviderClick,
    handleSchoolUpdated,
    handleDisableSchool,
    handleDisableConfirm,
    handleIconComplete,
    compactTimeAgo,
    loadProviders,
  } = useCuratorSchoolDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf9f7]">
        <button
          onClick={() => router.push(ROUTES.curator.schools)}
          className="mb-3 text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back to Schools
        </button>
        <p className="text-red-500 text-sm">{error || "School not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <div className="flex-1 flex flex-col lg:flex-row items-start relative">
        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col px-4 py-6 sm:px-6 lg:px-8 xl:px-10 relative z-10 max-w-7xl mx-auto w-full">
          <SchoolHeaderCard
            school={school}
            campusLabel={campusLabel}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditClick={() => setShowEditModal(true)}
            onDisableClick={handleDisableSchool}
          />

          <SchoolTabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            patientsCount={patients.length}
            iconsCount={schoolIcons.length}
            providersCount={providers.length}
            onAddIconClick={() => {
              setEditingIcon(null);
              setShowAddIconModal(true);
            }}
          />

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-100 p-1">
            {activeTab === "patients" && (
              <div className="p-4 sm:p-6">
                <PatientsTab
                  patients={patients}
                  isLoading={patientsLoading}
                  schoolId={schoolId}
                  compactTimeAgo={compactTimeAgo}
                  onViewPatient={(patientId) =>
                    router.push(
                      `/curator/schools/${schoolId}/patients/${patientId}`,
                    )
                  }
                />
              </div>
            )}

            {activeTab === "icons" && (
              <div className="p-4 sm:p-6">
                <IconsTab
                  icons={schoolIcons}
                  onIconClick={(icon) => {
                    setEditingIcon(icon);
                    setShowAddIconModal(true);
                  }}
                  onAddFirstIcon={() => {
                    setEditingIcon(null);
                    setShowAddIconModal(true);
                  }}
                />
              </div>
            )}

            {activeTab === "providers" && (
              <div className="p-4 sm:p-6">
                <ProvidersTab
                  providers={providers}
                  isLoading={providersLoading}
                  onProviderClick={handleProviderClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Urgent Care Sidebar */}
        <UrgentCareSidebar
          urgentCare={urgentCare}
          isLoading={urgentLoading}
          compactTimeAgo={compactTimeAgo}
          onLogoClick={() => router.push(ROUTES.curator.schools)}
        />
      </div>

      {/* Modals */}
      {school && (
        <>
          <SchoolEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
            onDisableSchool={handleDisableSchool}
          />
          <ConfirmationModal
            isOpen={showDisableModal}
            onClose={() => setShowDisableModal(false)}
            onConfirm={handleDisableConfirm}
            title="Disable School"
            message={`Are you sure you want to disable ${school.name}? This cannot be undone.`}
            confirmText="Yes, Disable"
            variant="danger"
            isLoading={isActionLoading}
          />
        </>
      )}

      <ProviderDetailsModal
        isOpen={showProviderModal}
        onClose={() => {
          setShowProviderModal(false);
          loadProviders();
        }}
        providerEmail={selectedProviderEmail}
        provider={
          providers.find((p) => p.email === selectedProviderEmail)
            ? (() => {
                const p = providers.find(
                  (p) => p.email === selectedProviderEmail,
                )!;
                return {
                  id: p.id,
                  email: p.email,
                  fullName: formatProviderName(p.providerName, p.providerTitle),
                  providerTitle:
                    getProviderTitle(p.providerName, p.providerTitle) ||
                    undefined,
                  professionalTitle: p.specialty || undefined,
                  profileImage: p.profilePhotoURL || undefined,
                  createdAt: "",
                  updatedAt: "",
                  applicationStatus: p.applicationStatus as
                    | "PENDING"
                    | "APPROVED"
                    | "REJECTED",
                  applicationDate: "",
                  bio: undefined,
                  officePhoneNumber: p.officePhoneNumber || undefined,
                } as ProviderDetails;
              })()
            : undefined
        }
      />

      <AddIconModal
        isOpen={showAddIconModal}
        onClose={() => {
          setShowAddIconModal(false);
          setEditingIcon(null);
        }}
        onComplete={handleIconComplete}
        editData={
          editingIcon
            ? {
                photoPreview: editingIcon.photoPreview,
                name: editingIcon.name,
                slogan: editingIcon.slogan,
                rank: editingIcon.rank,
                lockIns: editingIcon.lockIns || [],
              }
            : null
        }
        selectedSchool={school}
      />
    </div>
  );
}
