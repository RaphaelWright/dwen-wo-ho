"use client";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";
import type { useProviderSearchConfig } from "@/hooks/provider/search-config/use-search-config";
import { m } from "motion/react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card/index";
import type { PatientCase } from "@/lib/types/api/patient-results";
import { ClientOnly } from "@/components/ui/client-only";
import { NotificationBell } from "@/components/shared/notification-bell/index";
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
    <m.button
      onClick={onOpenProfile}
      whileHover={{
        paddingLeft: "10px",
        paddingRight: "15px",
        scale: 0.99,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      className="bg-card/60 hover:bg-card border-border/50 hover:border-primary/30 flex min-w-70 shrink-0 cursor-pointer flex-row items-center justify-between rounded-full border py-2 pr-3.5 pl-2.5 text-left hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="border-primary size-13.5 shrink-0 border-[3px]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
          </Avatar>
        </div>

        {/* Name + spec */}
        <div className="text-center">
          <div className="text-foreground flex items-center justify-center gap-1.5 text-[17px] font-bold">
            {providerTitle} {providerName}
            {/* Verification Badge */}
            <div
              className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white"
              title="Verified Provider"
            >
              ✓
            </div>
          </div>
          <div className="text-muted-foreground mt-0.5 text-[13.5px] font-medium tracking-tight">
            {specialty}
          </div>
        </div>
      </div>

      {/* Ranking Badge */}
      {ranking && (
        <div className="bg-primary/90 ring-primary ring-offset-background ml-3 flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-[2.5px] ring-offset-[3px]">
          <span className="text-lg font-black text-white">{ranking}</span>
        </div>
      )}
    </m.button>
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
    <header className="flex h-18 items-center justify-between border-b pr-2 pl-1 min-[1065px]:grid min-[1065px]:grid-cols-3 min-[1065px]:justify-stretch min-[1065px]:px-2">
      <div className="flex items-center gap-2">
        <ClientOnly fallback={<Logo variant="white" />}>
          <Logo
            variant={theme === "light" ? "black" : "white"}
            className="ml-1 min-[1065px]:ml-0"
            href={ROUTES.provider.home}
          />
        </ClientOnly>
        {/* Divider — desktop only */}
        <div className="bg-foreground/20 mx-5 hidden h-6 w-0.5 shrink-0 min-[1065px]:block" />
      </div>

      {/* Search — desktop only */}
      <div className="-ml-10 hidden min-[1065px]:flex xl:ml-[1vw]">
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
      <div className="ml-auto flex items-center gap-4">
        {/* Mobile search toggle */}
        <div className="min-[1065px]:hidden">
          <m.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen?.(!searchOpen)}
            className="bg-card/90 hover:bg-muted/80 flex size-9 cursor-pointer items-center justify-center rounded-lg border"
          >
            <Search className="size-5" />
          </m.button>
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
            renderSuggestion={(p: PatientCase) => (
              <PatientSuggestionCard
                name={p.patientName}
                score={p.score}
                status={p.status}
                school={p.schoolName}
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
