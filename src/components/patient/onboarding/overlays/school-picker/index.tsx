"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { SchoolPickerCard } from "@/components/patient/onboarding/overlays/school-picker/school-picker-card";
import { useSchoolPicker } from "@/hooks/components/patient/onboarding/school-picker/use-school-picker";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { SchoolPickerProps } from "@/lib/types/components/patient/onboarding";

export function SchoolPicker({
  open,
  schoolType,
  onOpenChange,
  onSelectSchool,
}: SchoolPickerProps) {
  const { schools, isLoading, searchQuery, setSearchQuery } = useSchoolPicker(
    schoolType,
    open,
  );

  return (
    <AnimatedModalShell
      isOpen={open}
      onClose={() => onOpenChange(false)}
      contentClassName="w-[min(88vw,56rem)] max-w-5xl"
      panelClassName="bg-background text-foreground border-border max-h-[88vh] rounded-2xl border-2 shadow-2xl"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="school-picker-title"
        className="flex max-h-[88vh] flex-col overflow-hidden"
      >
        <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Logo
              variant="auto"
              withLink={false}
              className="hidden h-8 w-auto sm:block"
            />
            <h2
              id="school-picker-title"
              className="font-heading text-foreground truncate text-lg font-semibold"
            >
              {ONBOARDING_COPY.schoolType.modalTitle}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-destructive/5 hover:text-destructive shrink-0"
            onClick={() => onOpenChange(false)}
            aria-label={ONBOARDING_COPY.policySheets.closeLabel}
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="border-border border-b px-5 py-4">
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={ONBOARDING_COPY.schoolType.searchPlaceholder}
              className="pl-10"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-5">
          {isLoading ? (
            <p className="text-muted-foreground text-center text-sm">
              {ONBOARDING_COPY.schoolType.pickerLoading}
            </p>
          ) : schools.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm">
              {ONBOARDING_COPY.schoolType.emptyResults}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <SchoolPickerCard
                  key={String(school.id)}
                  id={`school-card-${school.id}`}
                  name={school.name}
                  logo={school.logo}
                  nickname={school.nickname}
                  motto={school.motto}
                  studentCount={
                    school.totalPatients ?? school.studentCount ?? 0
                  }
                  onSelect={() => {
                    onSelectSchool({
                      id: String(school.id),
                      name: school.name,
                      logo: school.logo,
                    });
                    onOpenChange(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedModalShell>
  );
}
