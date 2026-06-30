"use client";

import { Input } from "@/components/ui/input";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { useProgrammePicker } from "@/hooks/components/patient/onboarding/programme-combobox/use-programme-picker";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ProgrammeStepProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

export function ProgrammeStep({
  programme,
  searchQuery,
  onSearchChange,
  onProgrammeSelect,
  canContinue,
  onContinue,
}: ProgrammeStepProps) {
  const { programmes } = useProgrammePicker(searchQuery);

  return (
    <StepShell
      title={ONBOARDING_COPY.programme.title}
      subtitle={ONBOARDING_COPY.programme.subtitle}
      centered
    >
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        className="flex w-full flex-col gap-4"
      >
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={ONBOARDING_COPY.programme.placeholder}
          className="border-border bg-card text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
        />

        <div className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-y-contain">
          {programmes.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              {ONBOARDING_COPY.programme.emptyResults}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {programmes.map((item) => {
                const isSelected = programme === item.name;

                return (
                  <li key={item.name}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={() => onProgrammeSelect(item)}
                      onKeyDown={activateOnKeyboard(() =>
                        onProgrammeSelect(item),
                      )}
                      className={`border-border hover:border-primary hover:bg-accent flex w-full cursor-pointer flex-col gap-2 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        isSelected ? "border-primary bg-accent" : "bg-card"
                      }`}
                    >
                      <span className="text-foreground text-base font-semibold">
                        {item.name}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted text-foreground rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </OnboardingContinueForm>
    </StepShell>
  );
}
