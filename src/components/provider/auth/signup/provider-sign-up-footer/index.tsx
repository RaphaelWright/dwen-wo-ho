"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import Stepper from "@/components/miscellaneous/stepper";
import { ProfileStepIndicator } from "@/components/provider/auth/signup/profile-step-indicator/index";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PROVIDER_SIGNUP_FOOTER_SLOTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { Z_INDEX_CLASSES } from "@/lib/constants/z-index";
import { ProviderSignUpFooterProps } from "@/lib/types/components/provider/auth/signup-footer";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/mock-data";
import { cn } from "@/lib/utils";

const footerButtonClassName = cn(
  PROVIDER_SIGNUP_FOOTER_SLOTS.rowHeight,
  "items-center justify-center",
);

const backButtonBaseClassName = cn(footerButtonClassName, "rounded-full px-6");

const backButtonInteractiveClassName = cn(
  backButtonBaseClassName,
  "border border-border bg-background text-foreground shadow-xs",
  "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out",
  "hover:border-primary hover:bg-primary/20 hover:shadow-md hover:ring-2 hover:ring-primary/25 hover:-translate-x-0.5",
  "active:translate-x-0 active:scale-[0.98]",
);

const backButtonInactiveClassName = cn(
  backButtonBaseClassName,
  "border border-transparent bg-transparent text-muted-foreground",
);

const actionButtonClassName = cn(
  footerButtonClassName,
  "rounded-full px-8 shadow-lg hover:shadow-xl transition-[box-shadow,background-color,color,opacity]",
  PROVIDER_SIGNUP_FOOTER_SLOTS.actionMinWidth,
);

export function ProviderSignUpFooter(props: ProviderSignUpFooterProps) {
  const hideBack = props.mode === "profile" && props.hideBack;
  const backDisabled = props.mode === "main" && props.backDisabled;
  const isBackInteractive = !hideBack && !backDisabled;

  return (
    <footer
      className={cn(
        "border-border bg-background/95 sticky bottom-0 mt-auto shrink-0 border-t backdrop-blur-md",
        Z_INDEX_CLASSES.stickyChrome,
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-start",
            PROVIDER_SIGNUP_FOOTER_SLOTS.rowHeight,
            PROVIDER_SIGNUP_FOOTER_SLOTS.backMinWidth,
          )}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={props.onBack}
            disabled={backDisabled}
            aria-hidden={hideBack || undefined}
            tabIndex={hideBack ? -1 : undefined}
            className={cn(
              isBackInteractive
                ? backButtonInteractiveClassName
                : backButtonInactiveClassName,
              hideBack && "pointer-events-none invisible",
            )}
          >
            {SIGN_UP_TEXTS.navigation.back}
          </Button>
        </div>

        <div
          className={cn(
            "flex items-center justify-center",
            PROVIDER_SIGNUP_FOOTER_SLOTS.rowHeight,
          )}
        >
          {props.mode === "main" ? (
            <Stepper
              steps={signUpSteps}
              step={props.stepLabel}
              className="py-0"
            />
          ) : (
            <ProfileStepIndicator currentStep={props.profileStep} />
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-end",
            PROVIDER_SIGNUP_FOOTER_SLOTS.rowHeight,
            PROVIDER_SIGNUP_FOOTER_SLOTS.actionMinWidth,
          )}
        >
          {props.mode === "main" ? (
            props.showNext ? (
              <Button
                form="create-account-form"
                type="submit"
                disabled={props.nextDisabled}
                className={actionButtonClassName}
              >
                {SIGN_UP_TEXTS.navigation.next}
              </Button>
            ) : (
              <div
                className={cn(
                  actionButtonClassName,
                  "pointer-events-none invisible",
                )}
                aria-hidden
              />
            )
          ) : (
            <LoadingButton
              type="button"
              onClick={props.onNext}
              loading={props.isSubmitting}
              loadingText={SIGN_UP_TEXTS.profile.submitting}
              disabled={props.nextDisabled}
              className={actionButtonClassName}
            >
              {props.profileStep === 2
                ? SIGN_UP_TEXTS.profile.submit
                : SIGN_UP_TEXTS.navigation.next}
            </LoadingButton>
          )}
        </div>
      </div>
    </footer>
  );
}
