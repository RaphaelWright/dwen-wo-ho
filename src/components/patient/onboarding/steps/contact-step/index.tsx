"use client";

import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { PhoneField } from "@/components/patient/onboarding/steps/phone-field";
import { EmailField } from "@/components/patient/onboarding/steps/email-field";
import { ContactFieldSubmit } from "@/components/patient/onboarding/steps/contact-field-submit";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  ONBOARDING_CONTACT_MODE_OPTIONS,
  ONBOARDING_COPY,
} from "@/lib/constants/components/patient/onboarding";
import type {
  ContactMode,
  ContactStepProps,
} from "@/lib/types/components/patient/onboarding";

export function ContactStep({
  contactMode,
  draft,
  fieldValidation,
  onContactModeChange,
  onDraftChange,
  onFieldBlur,
  onSubmit,
}: ContactStepProps) {
  const title =
    contactMode === "phone"
      ? ONBOARDING_COPY.contact.phoneTitle
      : ONBOARDING_COPY.contact.emailTitle;

  const validationState =
    contactMode === "phone" ? fieldValidation.phone : fieldValidation.email;

  return (
    <StepShell title={title} subtitle={ONBOARDING_COPY.contact.entrySubtitle}>
      <FieldGroup>
        <Field>
          <FieldTitle>{ONBOARDING_COPY.choice.title}</FieldTitle>
          <FieldDescription>{ONBOARDING_COPY.choice.subtitle}</FieldDescription>
          <FieldContent>
            <div
              className="bg-muted/60 mt-3 flex rounded-full p-1"
              role="group"
              aria-label="Contact method"
            >
              {ONBOARDING_CONTACT_MODE_OPTIONS.map(({ value, label }) => {
                const Icon = value === "phone" ? Phone : Mail;
                const isActive = contactMode === value;

                return (
                  <Button
                    key={value}
                    type="button"
                    variant={isActive ? "default" : "ghost"}
                    className={`h-10 flex-1 rounded-full ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => onContactModeChange(value as ContactMode)}
                    aria-pressed={isActive}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Button>
                );
              })}
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel
            htmlFor={
              contactMode === "phone" ? "patient-phone" : "patient-email"
            }
          >
            {contactMode === "phone"
              ? ONBOARDING_COPY.contact.phoneLabel
              : ONBOARDING_COPY.contact.emailLabel}
          </FieldLabel>
          <FieldContent>
            <ContactFieldSubmit onSubmit={onSubmit}>
              {contactMode === "phone" ? (
                <PhoneField
                  value={draft.phone}
                  validationState={validationState}
                  onChange={(phone) => onDraftChange({ phone })}
                  onBlur={() => onFieldBlur("phone")}
                />
              ) : (
                <EmailField
                  value={draft.email}
                  validationState={validationState}
                  onChange={(email) => onDraftChange({ email })}
                  onBlur={() => onFieldBlur("email")}
                />
              )}
            </ContactFieldSubmit>
          </FieldContent>
        </Field>

        <FieldDescription className="text-center">
          {ONBOARDING_COPY.contact.outsideGhanaNote}
        </FieldDescription>
      </FieldGroup>
    </StepShell>
  );
}
