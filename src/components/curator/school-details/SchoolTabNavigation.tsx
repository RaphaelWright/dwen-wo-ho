"use client";

import { Users } from "lucide-react";
import { SCHOOL_TABS_CONFIG } from "@/lib/constants/components/curator/school-details";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SchoolTabNavigationProps } from "@/lib/types/components/curator/school-details";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Search } from "lucide-react";

export function SchoolTabNavigation({
  activeTab,
  onTabChange,
  patientsCount,
  iconsCount,
  providersCount,
  onAddIconClick,
  searchQuery,
  setSearchQuery,
}: SchoolTabNavigationProps) {
  const tabs = SCHOOL_TABS_CONFIG.map((tab) => ({
    ...tab,
    count:
      tab.key === "patients"
        ? patientsCount
        : tab.key === "icons"
          ? iconsCount
          : providersCount,
  }));

  const getPlaceholders = () => {
    switch (activeTab) {
      case "icons":
        return [
          "Search for icons...",
          "Look up by name...",
          "Find by lock-in tag...",
        ];
      case "providers":
        return [
          "Search for providers...",
          "Look up by name or email...",
          "Find by specialty...",
          "Search by status...",
        ];
      case "patients":
      default:
        return [
          "Search for patients...",
          "Look up by name...",
          "Find by visibility status...",
          "Search in comments...",
        ];
    }
  };

  const currentPlaceholders = getPlaceholders();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex w-full sm:w-auto p-1 bg-muted/80 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              variant="ghost"
              className={cn(
                "relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-transparent",
                activeTab === tab.key
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/5 rounded-lg shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline capitalize">{tab.label}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary"
                      : "bg-muted-foreground/10 text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </span>
            </Button>
          );
        })}
      </div>

      {/* Context Actions based on Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "icons" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              onClick={onAddIconClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              Add Icon
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions/Search */}
      <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
        <div className="w-full sm:w-80 md:w-96 relative">
          <PlaceholdersAndVanishInput
            placeholders={currentPlaceholders}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
            }}
            className="w-full bg-muted/50 focus-within:bg-background border border-transparent focus-within:border-primary/20"
            submitButton={
              <button
                type="submit"
                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition duration-200 flex items-center justify-center"
              >
                <Search className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
