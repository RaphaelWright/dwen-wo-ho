"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordMatchIndicator from "@/components/shared/password-match-indicator";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator";
import { DobField } from "@/components/patient/onboarding/steps/dob-field";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  ONBOARDING_COPY,
  ONBOARDING_GENDER_OPTIONS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  CreateAccountStepProps,
  GenderValue,
} from "@/lib/types/components/patient/onboarding";
import {
  formatNickname,
  formatPersonName,
} from "@/lib/utils/patient/onboarding-format";

export function CreateAccountStep({
  contactValue,
  draft,
  onDraftChange,
}: CreateAccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <StepShell
      title={ONBOARDING_COPY.createAccount.title}
      subtitle={
        <>
          {ONBOARDING_COPY.createAccount.subtitlePrefix}{" "}
          <strong className="text-foreground font-semibold">
            {contactValue}
          </strong>{" "}
          {ONBOARDING_COPY.createAccount.subtitleSuffix}
        </>
      }
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="patient-first-name">
              {ONBOARDING_COPY.createAccount.firstName}
            </FieldLabel>
            <FieldContent>
              <Input
                id="patient-first-name"
                autoComplete="given-name"
                placeholder={ONBOARDING_COPY.createAccount.firstNamePlaceholder}
                value={draft.firstName}
                onChange={(event) =>
                  onDraftChange({
                    firstName: formatPersonName(event.target.value),
                  })
                }
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="patient-last-name">
              {ONBOARDING_COPY.createAccount.lastName}
            </FieldLabel>
            <FieldContent>
              <Input
                id="patient-last-name"
                autoComplete="family-name"
                placeholder={ONBOARDING_COPY.createAccount.lastNamePlaceholder}
                value={draft.lastName}
                onChange={(event) =>
                  onDraftChange({
                    lastName: formatPersonName(event.target.value),
                  })
                }
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="patient-nickname">
            {ONBOARDING_COPY.createAccount.nickname}
          </FieldLabel>
          <FieldContent>
            <Input
              id="patient-nickname"
              autoComplete="nickname"
              placeholder={ONBOARDING_COPY.createAccount.nicknamePlaceholder}
              value={draft.nickname}
              onChange={(event) =>
                onDraftChange({ nickname: formatNickname(event.target.value) })
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldTitle>{ONBOARDING_COPY.createAccount.gender}</FieldTitle>
          <FieldContent>
            <div className="flex gap-2" role="group" aria-label="Gender">
              {ONBOARDING_GENDER_OPTIONS.map((option) => {
                const isActive = draft.gender === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={`h-10 min-w-0 flex-1 gap-2 rounded-full ${
                      isActive ? "bg-primary text-primary-foreground" : ""
                    }`}
                    aria-pressed={isActive}
                    onClick={() =>
                      onDraftChange({ gender: option.value as GenderValue })
                    }
                  >
                    <Image
                      src={option.iconSrc}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0 object-contain"
                    />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </FieldContent>
        </Field>

        <DobField
          birthMonth={draft.birthMonth}
          birthDay={draft.birthDay}
          birthYear={draft.birthYear}
          onChange={onDraftChange}
        />

        <Field>
          <FieldLabel htmlFor="patient-password">
            {ONBOARDING_COPY.createAccount.password}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Input
                id="patient-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={ONBOARDING_COPY.createAccount.passwordPlaceholder}
                value={draft.password}
                className="pr-16"
                onChange={(event) =>
                  onDraftChange({ password: event.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground absolute top-1/2 right-1 h-8 -translate-y-1/2 px-3 text-xs font-semibold tracking-wide"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </Button>
            </div>
            {draft.password ? (
              <PasswordStrengthIndicator password={draft.password} />
            ) : null}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="patient-confirm-password">
            {ONBOARDING_COPY.createAccount.confirmPassword}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Input
                id="patient-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={
                  ONBOARDING_COPY.createAccount.confirmPasswordPlaceholder
                }
                value={draft.confirmPassword}
                className="pr-16"
                onChange={(event) =>
                  onDraftChange({ confirmPassword: event.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground absolute top-1/2 right-1 h-8 -translate-y-1/2 px-3 text-xs font-semibold tracking-wide"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword
                  ? ONBOARDING_COPY.createAccount.hidePassword
                  : ONBOARDING_COPY.createAccount.showPassword}
              </Button>
            </div>
            {draft.confirmPassword ? (
              <PasswordMatchIndicator
                password={draft.password}
                confirmPassword={draft.confirmPassword}
                matchLabel={ONBOARDING_COPY.createAccount.passwordMatch}
                mismatchLabel={ONBOARDING_COPY.createAccount.passwordMismatch}
              />
            ) : null}
          </FieldContent>
        </Field>
      </FieldGroup>
    </StepShell>
  );
}
