"use client";

import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/provider/new/nav-bar";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/provider/new/urgent-panel";
import NotificationsSheet from "@/components/provider/new/notification-sheet";
import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import LiquidGlass from "@/components/ui/liquid-glass";
import useNewProvider from "@/hooks/provider/use-new-provider";
import {
  useNewProviderMobile,
  type MobilePanel,
} from "@/hooks/provider/use-new-provider-mobile";
import { SearchBar } from "@/components/provider/new/nav-bar";

export default function ProviderDashboardPage() {
  const { searchQuery, setSearchQuery } = useNewProvider();
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
    <div className="overflow-x-hidden h-dvh md:h-screen md:overflow-hidden flex flex-col w-full px-0.5 md:px-0">
      <Navbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden md:grid grid-cols-[20%_60%_20%] flex-1 overflow-hidden w-full">
        <SchoolsSidebar />
        <MainContent />
        <UrgentPanel />
      </div>

      {/* ── Mobile: single panel ── */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        {/* Search overlay & backdrop */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* Click-outside backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-background/20 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
              />

              {/* Search bar */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0 left-0 right-0 z-40 p-3"
              >
                <LiquidGlass cornerRadius={20} blur={16} padding="0px 0px">
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </LiquidGlass>
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
              <UrgentPanel />
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
      <NotificationsSheet />
      <ProfileModal />
      <EditFieldDialog />
    </div>
  );
}
