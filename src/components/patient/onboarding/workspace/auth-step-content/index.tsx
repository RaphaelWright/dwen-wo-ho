"use client";

import type { ReactNode } from "react";

import { ChoiceStep } from "@/components/patient/onboarding/steps/choice-step";
import { ContactStep } from "@/components/patient/onboarding/steps/contact-step";
import { CreateAccountStep } from "@/components/patient/onboarding/steps/create-account-step";
import { VerifyStep } from "@/components/patient/onboarding/steps/verify-step";
import { ProfilePhotoStep } from "@/components/patient/onboarding/steps/profile-photo-step";
import { SignInStep } from "@/components/patient/onboarding/steps/sign-in-step";
import { ForgotPasswordStep } from "@/components/patient/onboarding/steps/forgot-password-step";
import { NewPasswordStep } from "@/components/patient/onboarding/steps/new-password-step";
import { PolicySheet } from "@/components/patient/onboarding/overlays/policy-sheet";

import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";

import type {
  OnboardingScreen,
  OnboardingStepContentProps,
} from "@/lib/types/components/patient/onboarding";

function renderAuthStep(
  screen: OnboardingScreen,
  props: OnboardingStepContentProps,
): ReactNode {
  const contactValue =
    props.contactMode === "phone" ? props.draft.phone : props.draft.email;

  const renderers: Partial<Record<OnboardingScreen, () => ReactNode>> = {
    [ONBOARDING_SCREENS.CHOICE]: () => (
      <ChoiceStep
        contactMode={null}
        onContactModeChange={props.onContactModeChange}
        onContinue={props.onChoiceContinue}
        onOpenTermsSheet={props.onOpenTermsSheet}
      />
    ),

    [ONBOARDING_SCREENS.CONTACT]: () => (
      <ContactStep
        contactMode={props.contactMode}
        draft={props.draft}
        fieldValidation={props.fieldValidation}
        onDraftChange={props.onDraftChange}
        onFieldBlur={props.onFieldBlur}
        onSubmit={props.onContactSubmit}
        onOpenCanadaSheet={props.onOpenCanadaSheet}
        onOpenTermsSheet={props.onOpenTermsSheet}
      />
    ),

    [ONBOARDING_SCREENS.CREATE_ACCOUNT]: () => (
      <CreateAccountStep
        contactValue={contactValue}
        contactMode={props.contactMode}
        draft={props.draft}
        fieldValidation={props.fieldValidation}
        onDraftChange={props.onDraftChange}
        onFieldBlur={props.onFieldBlur}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),

    [ONBOARDING_SCREENS.VERIFY]: () => (
      <VerifyStep
        contactValue={contactValue}
        otp={props.otp}
        verifyFlow={props.verifyFlow}
        onOtpChange={props.onOtpChange}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),

    [ONBOARDING_SCREENS.PROFILE_PHOTO]: () => (
      <ProfilePhotoStep
        profilePhotoUrl={props.draft.profilePhotoUrl}
        onPhotoChange={props.onPhotoChange}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),

    [ONBOARDING_SCREENS.SIGN_IN]: () => (
      <SignInStep
        nickname={props.draft.nickname}
        contactValue={contactValue}
        password={props.signInPassword}
        validationState={props.fieldValidation.password}
        onPasswordChange={props.onSignInPasswordChange}
        onBlur={() => props.onFieldBlur("password")}
        onForgotPassword={props.onForgotPassword}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),

    [ONBOARDING_SCREENS.FORGOT_PASSWORD]: () => (
      <ForgotPasswordStep
        contactValue={contactValue}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),

    [ONBOARDING_SCREENS.NEW_PASSWORD]: () => (
      <NewPasswordStep
        contactValue={contactValue}
        password={props.draft.password}
        confirmPassword={props.draft.confirmPassword}
        fieldValidation={props.fieldValidation}
        onPasswordChange={(password) => props.onDraftChange({ password })}
        onConfirmPasswordChange={(confirmPassword) =>
          props.onDraftChange({ confirmPassword })
        }
        onFieldBlur={props.onFieldBlur}
        canContinue={props.canContinue}
        onContinue={props.onContinue}
      />
    ),
  };

  return renderers[screen]?.() ?? null;
}

export function OnboardingAuthStepContent(props: OnboardingStepContentProps) {
  return (
    <>
      {renderAuthStep(props.screen, props)}
      {props.policySheet ? (
        <PolicySheet
          open
          onOpenChange={(open) => {
            if (!open) {
              props.onClosePolicySheet();
            }
          }}
          variant={props.policySheet}
        />
      ) : null}
    </>
  );
}
