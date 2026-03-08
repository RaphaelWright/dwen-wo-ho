"use client";

import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/provider/new/nav-bar";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/shared/urgent-panel";
import NotificationsSheet from "@/components/shared/notification-sheet";
import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import LiquidGlass from "@/components/ui/liquid-glass";
import useNewProvider from "@/hooks/provider/use-new-provider";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import {
  useNewProviderMobile,
  type MobilePanel,
} from "@/hooks/provider/use-new-provider-mobile";
import { NEW_PROVIDER_URGENT_PATIENTS } from "@/data/mock-provider-data";
import { cn } from "@/lib/utils";

export default function ProviderDashboardPage() {
  const {
    searchQuery,
    setSearchQuery,
    topSuggestions,
    quickFilters,
    notifications,
    notifOpen,
    setNotifOpen,
    markAllRead,
    markOneRead,
    clearAllNotifications,
  } = useNewProvider();
  const {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
  } = useNewProviderMobile();

  return (
    <div className="overflow-x-hidden h-dvh min-[1065px]:h-screen min-[1065px]:overflow-hidden flex flex-col w-full px-0.5 min-[1065px]:px-0">
      <Navbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden min-[1065px]:grid grid-cols-[15%_60%_25%] flex-1 overflow-hidden w-full">
        <SchoolsSidebar />
        <MainContent />
        <UrgentPanel patients={NEW_PROVIDER_URGENT_PATIENTS} />
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

              {/* Search bar container - clicking empty space here closes search */}
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
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      placeholders={["Search patients...", "Search schools…"]}
                      suggestions={topSuggestions}
                      quickFilters={quickFilters}
                      autoFocus={true}
                      fullMobileHeight={true}
                      onSelectOption={(val) => {
                        setSearchQuery(val);
                        setSearchOpen(false);
                      }}
                      getSuggestionValue={(p) => p.name}
                      renderSuggestion={PatientSuggestionCard}
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
              <SchoolsSidebar />
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
              <MainContent />
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
              <UrgentPanel patients={NEW_PROVIDER_URGENT_PATIENTS} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* ── Mobile glass navbar ── */}
        <LiquidGlassNavbar
          tabs={mobileTabs}
          activeTab={activePanel}
          onTabChange={(id) => setActivePanel(id as MobilePanel)}
          layoutId="mobile-glass-pill"
          className="absolute!"
        />
      </div>
      <NotificationsSheet
        notifications={notifications}
        isOpen={notifOpen}
        onOpenChange={setNotifOpen}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
        clearAllNotifications={clearAllNotifications}
      />
      <ProfileModal />
      <EditFieldDialog />
    </div>
  );
}
