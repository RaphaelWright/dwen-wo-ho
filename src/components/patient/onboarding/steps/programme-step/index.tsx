"use client";

import { useState } from "react";
import { SchoolContextPill } from "@/components/patient/onboarding/steps/school-context-pill";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { useProgrammePicker } from "@/hooks/components/patient/onboarding/programme-combobox/use-programme-picker";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ProgrammeStepProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

export function ProgrammeStep({
  programme,
  schoolName,
  schoolLogo,
  schoolType,
  searchQuery,
  onSearchChange,
  onProgrammeSelect,
  canContinue,
  onContinue,
  screenClassName,
}: ProgrammeStepProps) {
  const { programmes } = useProgrammePicker(searchQuery);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen((current) => {
      const next = !current;
      if (!next) {
        onSearchChange("");
      }
      return next;
    });
  };

  return (
    <OnboardingContinueForm
      canContinue={canContinue}
      onContinue={onContinue}
      className={cn("screen onboarding-step", screenClassName)}
    >
      <div className="programme-pinned">
        {schoolName ? (
          <SchoolContextPill
            schoolName={schoolName}
            schoolLogo={schoolLogo}
            schoolType={schoolType}
            onChangeSchool={() => {}}
          />
        ) : null}

        <div className="screen-header-row">
          <div>
            <h1 className="screen-title">{ONBOARDING_COPY.programme.title}</h1>
            <p className="screen-sub">{ONBOARDING_COPY.programme.subtitle}</p>
          </div>
          <div className="search-row">
            <div
              className={cn("search-box-wrap", searchOpen && "open")}
              id="programmeSearchBoxWrap"
            >
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  id="programmeSearchInput"
                  placeholder={ONBOARDING_COPY.programme.placeholder}
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </div>
            </div>
            <button
              className={cn("search-toggle", searchOpen && "active")}
              id="programmeSearchToggleBtn"
              type="button"
              onClick={toggleSearch}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      <div className="programme-list" id="programmeList">
        {programmes.length === 0 ? (
          <div className="programme-empty">
            {ONBOARDING_COPY.programme.emptyResults}
          </div>
        ) : (
          programmes.map((item) => {
            const isSelected = programme === item.name;

            return (
              <div
                key={item.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                className={cn("programme-pill", isSelected && "selected")}
                onClick={() => onProgrammeSelect(item)}
                onKeyDown={activateOnKeyboard(() => onProgrammeSelect(item))}
              >
                <div className="programme-main">
                  <div className="programme-name">{item.name}</div>
                  <div className="programme-chip-row">
                    {item.tags.map((tag) => (
                      <span key={tag} className="programme-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="check-badge">✓</div>
              </div>
            );
          })
        )}
      </div>
    </OnboardingContinueForm>
  );
}
