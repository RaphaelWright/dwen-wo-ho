"use client";

import { useEffect, useState } from "react";
import { SchoolPickerCard } from "@/components/patient/onboarding/overlays/school-picker/school-picker-card";
import { OnboardingBrandLogo } from "@/components/patient/onboarding/brand-logo";
import { useSchoolPicker } from "@/hooks/components/patient/onboarding/school-picker/use-school-picker";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { SchoolPickerProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

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
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [open, setSearchQuery]);

  const toggleSearch = () => {
    setSearchOpen((current) => {
      const next = !current;
      if (!next) {
        setSearchQuery("");
      }
      return next;
    });
  };

  const modalTitle =
    schoolType === "high-school"
      ? "Select your high school"
      : "Select your college";

  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      id="schoolModalOverlay"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="school-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="school-modal-header">
          <div className="brand">
            <OnboardingBrandLogo placement="modal-header" />
          </div>
          <h2 className="school-modal-title" id="modalTitle">
            {modalTitle}
          </h2>
          <div className="search-row">
            <div
              className={cn("search-box-wrap", searchOpen && "open")}
              id="searchBoxWrap"
            >
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  id="schoolSearchInput"
                  placeholder={ONBOARDING_COPY.schoolType.searchPlaceholder}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>
            <button
              className={cn("search-toggle", searchOpen && "active")}
              id="searchToggleBtn"
              type="button"
              onClick={toggleSearch}
            >
              🔍
            </button>
          </div>
        </div>

        <div className="school-grid-wrap">
          <div className="school-grid" id="schoolGrid">
            {isLoading ? (
              <div className="school-empty">
                {ONBOARDING_COPY.schoolType.pickerLoading}
              </div>
            ) : schools.length === 0 ? (
              <div className="school-empty">
                {ONBOARDING_COPY.schoolType.emptyResults}
              </div>
            ) : (
              schools.map((school, index) => (
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
                  animationDelay={index * 0.04}
                  onSelect={() => {
                    onSelectSchool({
                      id: String(school.id),
                      name: school.name,
                      logo: school.logo,
                    });
                    onOpenChange(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
