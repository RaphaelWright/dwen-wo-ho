"use client";

import { Users, Star, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type SchoolTab = "patients" | "icons" | "providers";

interface SchoolTabNavigationProps {
  activeTab: SchoolTab;
  onTabChange: (tab: SchoolTab) => void;
  patientsCount: number;
  iconsCount: number;
  providersCount: number;
  onAddIconClick: () => void;
}

export function SchoolTabNavigation({
  activeTab,
  onTabChange,
  patientsCount,
  iconsCount,
  providersCount,
  onAddIconClick,
}: SchoolTabNavigationProps) {
  const tabs = [
    {
      key: "patients" as const,
      label: "Patients",
      icon: Users,
      count: patientsCount,
    },
    { key: "icons" as const, label: "Icons", icon: Star, count: iconsCount },
    {
      key: "providers" as const,
      label: "Providers",
      icon: Stethoscope,
      count: providersCount,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex w-full sm:w-auto p-1 bg-gray-100/80 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#955aa4]/20",
                activeTab === tab.key
                  ? "text-[#955aa4]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
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
                      ? "bg-[#955aa4]/10 text-[#955aa4]"
                      : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.count}
                </span>
              </span>
            </button>
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
              className="bg-[#955aa4] hover:bg-[#864e94] text-white shadow-md shadow-[#955aa4]/20 rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              Add Icon
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
