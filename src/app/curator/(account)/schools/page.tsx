"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, School, Search } from "lucide-react";
import WidthConstraint from "@/components/ui/width-constraint";
import {
  useCuratorSchools,
  FILTER_OPTIONS,
} from "@/hooks/curator/useCuratorSchools";
import { SchoolCard } from "@/components/curator/SchoolCard";
import { NotificationSheet } from "@/components/ui/notification-sheet";
import { useNotification } from "@/hooks/useNotification";
import { FiBell } from "react-icons/fi";

export default function SchoolsPage() {
  const {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    hasCachedData,
    isError,
  } = useCuratorSchools();

  const {
    notifications,
    clearNotifications,
    dismissNotification,
    unreadCount,
    addNotification, // Added for verification
  } = useNotification();

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-8 p-8 items-center justify-center min-h-[40vh]">
          <div className="text-center text-destructive font-medium">
            Failed to load schools
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Schools
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and view all registered educational institutions
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Test Notification Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                onClick={() => {
                  if (schoolsList.length > 0) {
                    const sampleSchool = schoolsList[0];
                    addNotification(
                      "success",
                      `New school added: ${sampleSchool.name}`,
                      `/curator/schools/${sampleSchool.id}`,
                    );
                  } else {
                    addNotification(
                      "success",
                      "New school added: Achimota School",
                      "/curator/schools/4",
                    );
                  }
                }}
              >
                Test: School (Link)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                onClick={() => {
                  const schoolWithPatient = schoolsList.find(
                    (s) => s.newPatientId,
                  );
                  if (schoolWithPatient) {
                    addNotification(
                      "info",
                      `New patient: ${schoolWithPatient.newPatientName} at ${schoolWithPatient.name}`,
                      `/curator/schools/${schoolWithPatient.id}/patients/${schoolWithPatient.newPatientId}`,
                    );
                  } else {
                    addNotification(
                      "info",
                      "New patient: Maame Abena Pokuaa at Achimota School",
                      "/curator/schools/4/patients/122",
                    );
                  }
                }}
              >
                Test: Patient (Link)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                onClick={() =>
                  addNotification(
                    "error",
                    "School removed: Mfantsipim School is no longer available",
                    // No link for errors usually
                  )
                }
              >
                Test: Error (No Link)
              </Button>
            </div>
            <NotificationSheet
              notifications={notifications}
              onClear={clearNotifications}
              onDismiss={dismissNotification}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-10 w-10 rounded-full border-border"
                >
                  <FiBell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-destructive border-2 border-white transform translate-x-1/4 -translate-y-1/4" />
                  )}
                </Button>
              }
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search schools by name, nickname, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-background border-input focus-visible:ring-primary rounded-xl shadow-sm transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full transition-all duration-300 ${
                  activeFilter === filter.value
                    ? "shadow-md scale-105"
                    : "hover:bg-muted"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading && !hasCachedData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">
              Loading schools...
            </p>
          </div>
        ) : schoolsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <School className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                No schools found
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {activeFilter === "all"
                  ? "There are no schools registered yet."
                  : `There are no schools under the "${FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label}" category.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {schoolsList.map((school, i) => (
              <div
                key={school.id}
                className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <SchoolCard school={school} />
              </div>
            ))}
          </div>
        )}
      </div>
    </WidthConstraint>
  );
}
