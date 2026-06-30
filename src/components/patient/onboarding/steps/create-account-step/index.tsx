"use client";

import { useState } from "react";
import { DobField } from "@/components/patient/onboarding/steps/dob-field";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type {
  CreateAccountStepProps,
  GenderValue,
} from "@/lib/types/components/patient/onboarding";
import {
  formatNickname,
  formatPersonName,
} from "@/lib/utils/patient/onboarding-format";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

function getPasswordChecklist(password: string) {
  return {
    length: password.length >= 6,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  };
}

function splitNameForDraft(name: string) {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || firstName;

  return { firstName, lastName, fullName: trimmed };
}

export function CreateAccountStep({
  contactValue,
  draft,
  onDraftChange,
  canContinue,
  onContinue,
}: CreateAccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordRules = getPasswordChecklist(draft.password);
  const displayName =
    draft.fullName.trim() || draft.firstName.trim() || draft.lastName.trim();

  const handleNameChange = (value: string) => {
    const formatted = formatPersonName(value);
    onDraftChange(splitNameForDraft(formatted));
  };

  return (
    <StepShell
      title={ONBOARDING_COPY.createAccount.title}
      subtitle={
        <>
          {ONBOARDING_COPY.createAccount.subtitlePrefix}{" "}
          <strong>{contactValue}</strong>{" "}
          {ONBOARDING_COPY.createAccount.subtitleSuffix}
        </>
      }
      centered
    >
      <OnboardingContinueForm canContinue={canContinue} onContinue={onContinue}>
        <div className="field-group">
          <div className="input-box">
            <div className="box-title">YOUR NAME</div>
            <div className="input-wrap">
              <input
                type="text"
                id="patient-name"
                autoComplete="name"
                placeholder="What's your name?"
                value={displayName}
                onChange={(event) => handleNameChange(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="field-group">
          <div className="input-box">
            <div className="box-title">NICKNAME</div>
            <div className="input-wrap">
              <input
                type="text"
                id="patient-nickname"
                autoComplete="nickname"
                placeholder={ONBOARDING_COPY.createAccount.nicknamePlaceholder}
                value={draft.nickname}
                onChange={(event) =>
                  onDraftChange({
                    nickname: formatNickname(event.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="field-group">
          <div className="box-title" style={{ marginBottom: 10 }}>
            {ONBOARDING_COPY.createAccount.gender}
          </div>
          <div className="gender-row" role="group" aria-label="Gender">
            {(
              [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ] as const
            ).map((option) => {
              const isSelected = draft.gender === option.value;

              return (
                <div
                  key={option.value}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={cn("gender-pill", isSelected && "selected")}
                  data-gender={option.label}
                  onClick={() =>
                    onDraftChange({ gender: option.value as GenderValue })
                  }
                  onKeyDown={activateOnKeyboard(() =>
                    onDraftChange({ gender: option.value as GenderValue }),
                  )}
                >
                  {option.label} <span className="check" />
                </div>
              );
            })}
          </div>
        </div>

        <DobField
          birthMonth={draft.birthMonth}
          birthDay={draft.birthDay}
          birthYear={draft.birthYear}
          onChange={onDraftChange}
        />

        <div className="field-group">
          <div className="input-box">
            <div className="box-title">
              {ONBOARDING_COPY.createAccount.password}
            </div>
            <div className="input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="patient-password"
                autoComplete="new-password"
                placeholder={ONBOARDING_COPY.createAccount.passwordPlaceholder}
                value={draft.password}
                onChange={(event) =>
                  onDraftChange({
                    password: event.target.value,
                    confirmPassword: event.target.value,
                  })
                }
              />
              <button
                className="show-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </button>
            </div>
          </div>
          <ul className="pw-checklist">
            <li
              data-rule="length"
              className={cn(passwordRules.length && "met")}
            >
              6+ characters
            </li>
            <li
              data-rule="letter"
              className={cn(passwordRules.letter && "met")}
            >
              One letter
            </li>
            <li
              data-rule="number"
              className={cn(passwordRules.number && "met")}
            >
              One number
            </li>
          </ul>
        </div>
      </OnboardingContinueForm>
    </StepShell>
  );
}
