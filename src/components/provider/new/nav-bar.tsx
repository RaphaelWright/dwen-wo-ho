"use client";

import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import type { useProviderSearchConfig } from "@/hooks/provider/use-provider-search-config";
import { motion, useAnimation } from "framer-motion";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import { ClientOnly } from "@/components/ui/client-only";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ROUTES } from "@/lib/constants/routes";

const ProviderIdentity = ({
  providerTitle,
  providerName,
  specialty,
  avatarUrl,
  ranking,
  onOpenProfile,
}: {
  providerTitle: string;
  providerName: string;
  specialty: string;
  avatarUrl?: string;
  ranking?: string;
  onOpenProfile: () => void;
}) => {
  const fallback = providerName?.charAt(0).toUpperCase() || "PR";

  return (
    <motion.button
      onClick={onOpenProfile}
      whileHover={{
        paddingLeft: "10px",
        paddingRight: "15px",
        scale: 0.99,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      className="flex flex-row items-center justify-between min-w-70 cursor-pointer py-2 pl-2.5 pr-3.5 rounded-full shrink-0 text-left bg-card/60 hover:bg-card border border-border/50 hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="size-13.5 shrink-0 border-[3px] border-primary">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
          </Avatar>
        </div>

        {/* Name + spec */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-[17px] font-bold text-foreground">
            {providerTitle} {providerName}
            {/* Verification Badge */}
            <div
              className="size-4.5 rounded-full flex items-center justify-center text-white text-[10px] bg-sky-500 shrink-0 mt-0.5"
              title="Verified Provider"
            >
              ✓
            </div>
          </div>
          <div className="text-[13.5px] font-medium text-muted-foreground mt-0.5 tracking-tight">
            {specialty}
          </div>
        </div>
      </div>

      {/* Ranking Badge */}
      {ranking && (
        <div className="ml-3 shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/90 ring-[2.5px] ring-primary ring-offset-[3px] ring-offset-background shadow-sm">
          <span className="text-white font-black text-lg">{ranking}</span>
        </div>
      )}
    </motion.button>
  );
};

export default function ProviderNavbar({
  searchOpen,
  setSearchOpen,
  profileData,
  unreadCount,
  setProfileOpen,
  setNotifOpen,
  theme,
  searchConfig,
  quickFilters,
}: {
  searchOpen?: boolean;
  setSearchOpen?: (open: boolean) => void;
  profileData: ProviderDashboardState["profileData"];
  unreadCount: ProviderDashboardState["unreadCount"];
  setProfileOpen: ProviderDashboardState["setProfileOpen"];
  setNotifOpen: ProviderDashboardState["setNotifOpen"];
  theme: ProviderDashboardState["theme"];
  searchConfig: ReturnType<typeof useProviderSearchConfig>;
  quickFilters: ProviderDashboardState["quickFilters"];
}) {
  const {
    name = "",
    specialty = "",
    title = "",
    avatarUrl = "",
    ranking,
  } = profileData ?? {};

  return (
    <header className="flex min-[1065px]:grid min-[1065px]:grid-cols-3 items-center justify-between min-[1065px]:justify-stretch pl-1 pr-2 min-[1065px]:px-2 h-18 border-b">
      <div className="flex gap-2 items-center">
        <ClientOnly fallback={<Logo variant="white" />}>
          <Logo
            variant={theme === "light" ? "black" : "white"}
            className="ml-1 min-[1065px]:ml-0"
            href={ROUTES.provider.home}
          />
        </ClientOnly>
        {/* Divider — desktop only */}
        <div className="hidden min-[1065px]:block w-0.5 h-6 mx-5 shrink-0 bg-foreground/20" />
      </div>

      {/* Search — desktop only */}
      <div className="hidden min-[1065px]:flex -ml-10 xl:ml-[1vw] ">
        <ProviderIdentity
          providerTitle={title}
          providerName={name}
          specialty={specialty}
          avatarUrl={avatarUrl}
          ranking={ranking}
          onOpenProfile={() => setProfileOpen(true)}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Mobile search toggle */}
        <div className="min-[1065px]:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen?.(!searchOpen)}
            className="size-9 flex items-center justify-center rounded-lg border cursor-pointer bg-card/90 hover:bg-muted/80"
          >
            <Search className="size-5" />
          </motion.button>
        </div>

        {/* Provider identity — desktop only */}
        <ThemeToggle />
        <div className="hidden min-[1065px]:block">
          <SearchDropdown
            searchQuery={searchConfig.searchQuery}
            onSearchChange={searchConfig.setSearchQuery}
            placeholders={["Search patients...", "Search schools…"]}
            suggestions={searchConfig.topSuggestions}
            quickFilters={quickFilters}
            activeFilters={searchConfig.localActiveFilters}
            onSelectOption={(val) => searchConfig.setSearchQuery(val)}
            onFilterChange={searchConfig.onFilterChange}
            onRemoveFilter={searchConfig.removeFilter}
            getSuggestionValue={searchConfig.getSuggestionValue}
            renderSuggestion={(p: any) => (
              <PatientSuggestionCard
                name={p.patientName}
                score={p.lockinScore}
                status={p.status}
                school={p.schoolName}
                {...p}
              />
            )}
            onSubmitSearch={searchConfig.onSubmitSearch}
            onSuggestionAction={searchConfig.onSuggestionAction}
            onResetSearch={searchConfig.onResetSearch}
          />
        </div>
        <NotificationBell
          unreadCount={unreadCount}
          onOpenNotifs={() => setNotifOpen(true)}
        />
      </div>
    </header>
  );
}
