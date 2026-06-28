"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import Stepper from "@/components/miscellaneous/stepper";
import { ProfileStepIndicator } from "@/components/provider/auth/signup/profile-step-indicator/index";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/components/shared/auth-flow";
import { ProviderSignUpFooterProps } from "@/lib/types/components/provider/auth/signup-footer";
import { cn } from "@/lib/utils";

export function ProviderSignUpFooter(props: ProviderSignUpFooterProps) {
  const hideBack = props.mode === "profile" && props.hideBack;
  const backDisabled = props.mode === "main" && props.backDisabled;
  const isBackInteractive = !hideBack && !backDisabled;

  return (
    <footer className="border-border bg-background/95 z-sticky-chrome sticky bottom-0 mt-auto shrink-0 border-t backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
        <div className="flex h-10 min-w-[5.5rem] items-center justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={props.onBack}
            disabled={backDisabled}
            aria-hidden={hideBack || undefined}
            tabIndex={hideBack ? -1 : undefined}
            className={cn(
              "flex h-10 items-center justify-center rounded-full px-6",
              isBackInteractive
                ? "border-border bg-background text-foreground hover:border-primary hover:bg-primary/20 hover:ring-primary/25 border shadow-xs transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-x-0.5 hover:shadow-md hover:ring-2 active:translate-x-0 active:scale-[0.98]"
                : "text-muted-foreground border border-transparent bg-transparent",
              hideBack && "pointer-events-none invisible",
            )}
          >
            {SIGN_UP_TEXTS.navigation.back}
          </Button>
        </div>

        <div className="flex h-10 items-center justify-center">
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

        <div className="flex h-10 min-w-[9.5rem] items-center justify-end">
          {props.mode === "main" ? (
            props.showNext ? (
              <Button
                form="create-account-form"
                type="submit"
                disabled={props.nextDisabled}
                className="flex h-10 min-w-[9.5rem] items-center justify-center rounded-full px-8 shadow-lg transition-[box-shadow,background-color,color,opacity] hover:shadow-xl"
              >
                {SIGN_UP_TEXTS.navigation.next}
              </Button>
            ) : (
              <div
                className="pointer-events-none invisible flex h-10 min-w-[9.5rem] items-center justify-center rounded-full px-8 shadow-lg"
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
              className="flex h-10 min-w-[9.5rem] items-center justify-center rounded-full px-8 shadow-lg transition-[box-shadow,background-color,color,opacity] hover:shadow-xl"
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
