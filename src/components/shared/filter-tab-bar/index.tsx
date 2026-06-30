"use client";

import { Button } from "@/components/ui/button";
import { m, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Search } from "lucide-react";
import type { FilterTabBarProps } from "@/lib/types/components/shared/filter-tab-bar";

const searchWidthClasses = {
  full: "w-full",
  sm: "w-full sm:w-64 md:w-72",
  md: "w-full sm:w-80 md:w-96",
  auto: "w-full md:w-auto",
};

export function FilterTabBar<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholders,
  searchQuery = "",
  onSearchChange,
  renderActions,
  showCount = true,
  className,
  tabsClassName,
  searchClassName,
  searchInputClassName,
  searchWidth = "md",
  activeTabLayoutId = "filterTabBar-activeTab",
}: FilterTabBarProps<T>) {
  const placeholders =
    typeof searchPlaceholders === "function"
      ? searchPlaceholders(activeTab)
      : (searchPlaceholders ?? []);

  const hasSearch = placeholders.length > 0 && onSearchChange !== undefined;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      <div
        className={cn(
          "bg-muted/80 flex w-full rounded-xl p-1 sm:w-auto",
          tabsClassName,
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const showBadge = showCount && tab.count !== undefined;
          return (
            <Button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              variant="ghost"
              className={cn(
                "relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-transparent sm:flex-none sm:px-6",
                isActive
                  ? "bg-primary hover:bg-primary/5 text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <m.div
                  layoutId={activeTabLayoutId}
                  className="bg-primary/5 absolute inset-0 rounded-lg shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden capitalize sm:inline">{tab.label}</span>
                {showBadge && (
                  <span
                    className={cn(
                      "min-w-5 rounded-full px-2 py-0.5 text-center text-[10px] font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted-foreground/10 text-muted-foreground",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </Button>
          );
        })}
      </div>

      {renderActions && (
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Intentional render prop: `renderActions` is part of this
                component's public API so callers can inject tab-specific
                actions. The output is keyed by `activeTab`, so identity is
                stable per tab and no state is lost. */}
            {renderActions(activeTab)}
          </m.div>
        </AnimatePresence>
      )}

      {hasSearch && (
        <div
          className={cn(
            "mt-4 flex w-full flex-col items-end gap-3 md:mt-0 md:w-auto",
            searchClassName,
          )}
        >
          <div className={cn("relative", searchWidthClasses[searchWidth])}>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              onSubmit={(e: React.SubmitEvent) => {
                e.preventDefault();
              }}
              className={cn(
                "bg-muted/50 focus-within:bg-background focus-within:border-primary/20 w-full border border-transparent",
                searchInputClassName,
              )}
              submitButton={
                <button
                  type="submit"
                  className="bg-primary/10 text-primary hover:bg-primary absolute top-1/2 right-2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition duration-200 hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
