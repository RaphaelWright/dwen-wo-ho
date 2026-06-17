"use client";

import { m, AnimatePresence } from "motion/react";
import LiquidGlass from "@/components/ui/liquid-glass";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card/index";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import type { ProviderDashboardMobileSearchOverlayProps } from "@/lib/types/components/provider/dashboard/desktop-layout";
import type { PatientCase } from "@/lib/types/api/patient-results";

export function ProviderDashboardMobileSearchOverlay({
  searchOpen,
  setSearchOpen,
  searchConfig,
  quickFilters,
  setActiveSchool,
  setActiveStatus,
}: ProviderDashboardMobileSearchOverlayProps) {
  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/20 absolute inset-0 z-60"
            role="button"
            tabIndex={0}
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            onKeyDown={activateOnKeyboard(() => setSearchOpen(false))}
          />
          <m.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-0 right-0 left-0 z-70 h-full p-3"
            role="button"
            tabIndex={0}
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            onKeyDown={activateOnKeyboard(() => setSearchOpen(false))}
          >
            <div
              className="mx-auto max-w-sm"
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
                  placeholders={["Search patients...", "Search schools"]}
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
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
