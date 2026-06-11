"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/shared/urgent-panel";
import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import LiquidGlass from "@/components/ui/liquid-glass";
import useProviderDashboard from "@/hooks/provider/use-provider-dashboard";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import { type MobilePanel } from "@/hooks/provider/use-provider-dashboard-mobile";
import { PendingApprovalModal } from "@/components/provider/pending-approval-modal";
import { cn } from "@/lib/utils";
import { toPendingApprovalUserInfo } from "@/lib/utils/provider-pending-modal";
import { performLogout } from "@/lib/auth-utils";
import type { PatientCase } from "@/lib/types/api/patient-results";
import ProviderActivityLog from "@/components/provider/provider-activity-log";
import ProviderNavbar from "@/components/provider/new/nav-bar";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";
import ProviderNotificationsSheet from "@/components/provider/new/provider-notification-sheet";
import useProviderDashboardAuth from "@/hooks/provider/use-provider-dashboard-auth";

export default function ProviderHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const {
    isApproved,
    isLoading: isAuthLoading,
    authProfile,
  } = useProviderDashboardAuth();
  const dashboard = useProviderDashboard();
  const {
    setActiveSchool,
    setActiveStatus,
    quickFilters,
    notifications,
    setNotifOpen,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    isMarkingRead,
    isDeleting,
    isMarkingAllRead,
    isClearing,
    activeSchool,
    handleSelectSchool,
    schools,
    filteredPatients,
    totalPatientCount,
    activeStatus,
    countForChip,
    profileOpen,
    setProfileOpen,
    profileData,
    openEdit,
    unreadCount,
    theme,
    editOpen,
    setEditOpen,
    editFieldKey,
    editFieldLabel,
    editValue,
    setEditValue,
    saveEdit,
    uploadAvatar,
    isUploadingAvatar,
    isSaving,
    isUpdatingPhoneNumber,
    isInitLoading,
    searchConfig,
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
    urgentData,
  } = dashboard;

  useEffect(() => {
    setMounted(true);
    const unreadNotifs = notifications.filter((n) => n.unread === true);

    let timeoutId: NodeJS.Timeout;

    if (unreadNotifs.length > 0) {
      timeoutId = setTimeout(() => {
        toast.info("You have unread notifications");
        setNotifOpen(true);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notifications, setNotifOpen]);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  // ── Early returns (AFTER all hooks are called) ──
  // if (!isApproved && !isAuthLoading) {
  //   if (isInitLoading || !profileData.name) {
  //     return (
  //       <div className="min-h-screen bg-background flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  //       </div>
  //     );
  //   }
  // }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  console.log(profileData);
  console.log(authProfile);
  console.log(Object.keys(profileData).length);

  return (
    <div className="overflow-x-hidden h-dvh min-[1065px]:h-screen min-[1065px]:overflow-hidden flex flex-col w-full px-0.5 min-[1065px]:px-0">
      <ProviderNavbar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        profileData={profileData}
        unreadCount={unreadCount}
        setProfileOpen={setProfileOpen}
        setNotifOpen={setNotifOpen}
        theme={theme}
        searchConfig={searchConfig}
        quickFilters={quickFilters}
      />

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden min-[1065px]:grid grid-cols-[18%_60%_22%] h-full overflow-hidden w-full">
        <div className="h-full overflow-hidden">
          <SchoolsSidebar
            activeSchool={activeSchool}
            handleSelectSchool={handleSelectSchool}
            schools={schools}
            totalPatientCount={totalPatientCount}
            isLoading={isInitLoading}
          />
        </div>
        <div className="h-full overflow-hidden">
          <MainContent
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            filteredPatients={filteredPatients}
            countForChip={countForChip}
            isLoading={isInitLoading}
          />
        </div>
        <div className="h-full overflow-hidden">
          <UrgentPanel
            patients={urgentData?.urgentPatients}
            activeSchool={activeSchool}
            onPatientClick={(patient) => {
              router.push(
                `${ROUTES.provider.patients}/${patient.patientResultId}`,
              );
            }}
          />
        </div>
      </div>

      {/* ── Mobile: single panel ── */}
      <div
        className={cn(
          "min-[1065px]:hidden flex-1 relative",
          searchOpen ? "overflow-visible" : "overflow-hidden",
        )}
      >
        {/* Search overlay & backdrop */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* Click-outside backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-60 bg-background/20"
                onClick={() => setSearchOpen(false)}
              />

              {/* Search bar container */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0 left-0 right-0 z-70 p-3 h-full"
                onClick={() => setSearchOpen(false)}
              >
                <div
                  className="max-w-sm mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LiquidGlass
                    cornerRadius={20}
                    blur={16}
                    padding="0px 0px"
                    style={{ overflow: "visible" }}
                  >
                    <SearchDropdown
                      searchQuery={searchConfig.searchQuery}
                      onSearchChange={searchConfig.setSearchQuery}
                      placeholders={["Search patients...", "Search schools…"]}
                      suggestions={searchConfig.topSuggestions}
                      quickFilters={quickFilters}
                      activeFilters={searchConfig.localActiveFilters}
                      autoFocus={true}
                      fullMobileHeight={true}
                      onSelectOption={(val) => {
                        searchConfig.setSearchQuery(val);
                        setSearchOpen(false);
                      }}
                      onFilterChange={searchConfig.onFilterChange}
                      onRemoveFilter={searchConfig.removeFilter}
                      getSuggestionValue={searchConfig.getSuggestionValue}
                      renderSuggestion={(p: PatientCase) => (
                        <PatientSuggestionCard
                          name={p.patientName}
                          score={p.score ?? 0}
                          status={p.status}
                        />
                      )}
                      onSubmitSearch={searchConfig.onSubmitSearch}
                      onSuggestionAction={searchConfig.onSuggestionAction}
                      onResetSearch={() => {
                        searchConfig.onResetSearch();
                        setActiveSchool("all");
                        setActiveStatus("all");
                      }}
                    />
                  </LiquidGlass>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Panel content */}
        <AnimatePresence mode="wait">
          {activePanel === "schools" && (
            <motion.div
              key="schools"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto"
            >
              <SchoolsSidebar
                activeSchool={activeSchool}
                handleSelectSchool={handleSelectSchool}
                schools={schools}
                totalPatientCount={totalPatientCount}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "patients" && (
            <motion.div
              key="patients"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 overflow-hidden h-screen"
            >
              <MainContent
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                filteredPatients={filteredPatients}
                countForChip={countForChip}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "urgent" && (
            <motion.div
              key="urgent"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto"
            >
              <UrgentPanel
                patients={urgentData?.urgentPatients}
                activeSchool={activeSchool}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "activity" && (
            <motion.div
              key="activity"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto bg-background"
            >
              <ProviderActivityLog />
            </motion.div>
          )}
        </AnimatePresence>

        <LiquidGlassNavbar
          tabs={mobileTabs}
          activeTab={activePanel}
          onTabChange={(id) => setActivePanel(id as MobilePanel)}
          layoutId="mobile-glass-pill"
          className="absolute!"
        />
      </div>
      <ProviderNotificationsSheet
        notifications={notifications}
        setNotifOpen={setNotifOpen}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
        deleteNotification={deleteNotification}
        clearAllNotifications={clearAllNotifications}
        router={router}
        isMarkingRead={isMarkingRead}
        isDeleting={isDeleting}
        isMarkingAllRead={isMarkingAllRead}
        isClearing={isClearing}
        getNotificationId={(n) => n.notificationId}
        isNotificationUnread={(n) => n.unread}
        getAvatarUrl={(n) => n.avatarUrl}
        getEmoji={(n) => n.emoji}
        getTitle={(n) => n.targetName}
        getText={(n) => n.text}
        getTimestamp={(n) => n.timestamp}
      />
      <ProfileModal
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={profileData}
        openEdit={openEdit}
        schools={schools}
      />
      <EditFieldDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editFieldKey={editFieldKey}
        editFieldLabel={editFieldLabel}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEdit={saveEdit}
        uploadAvatar={uploadAvatar}
        isUploadingAvatar={isUploadingAvatar}
        isSaving={isSaving || isUpdatingPhoneNumber}
        profileData={profileData}
      />

      {!isApproved && !isAuthLoading && (
        <PendingApprovalModal
          userInfo={toPendingApprovalUserInfo(
            Object.keys(profileData).length > 0 ? profileData : authProfile,
          )}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
