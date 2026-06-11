"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "@/components/ui/sonner";
import { authService } from "@/services/auth";
import { ROUTES } from "@/lib/constants/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { getProviderRedirectInfo } from "@/lib/utils/auth-redirect";
import {
  buildProviderSignupResumeUrl,
  getProviderProfileResumeStep,
  hasProviderAuthToken,
  isProviderSignupProfileStepSlug,
  profileStepSlugToIndex,
} from "@/lib/utils/provider-signup-resume";
import type { ProviderSignupGuardState } from "@/lib/types/provider/signup-resume";
import useGetSearchParams from "@/hooks/use-get-search-params";

export function useProviderSignupGuard(
  emailOverride?: string,
  enabled = true,
): ProviderSignupGuardState {
  const router = useRouter();
  const emailParam = useGetSearchParams("email");
  const stepParam = useGetSearchParams("step");
  const hasRunRef = useRef(false);

  const [state, setState] = useState<ProviderSignupGuardState>({
    isChecking: enabled,
    isResumeLocked: false,
    profileStep: null,
  });

  useEffect(() => {
    if (!enabled) {
      setState({
        isChecking: false,
        isResumeLocked: false,
        profileStep: null,
      });
      return;
    }

    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    // Client-side guard kept intentionally: resume/redirect decisions depend on
    // localStorage auth tokens and an authenticated profile fetch, neither of
    // which is available to Next.js middleware / server redirects.
    const resolveGuard = async () => {
      const email = emailParam
        ? decodeURIComponent(emailParam)
        : emailOverride || "";

      const redirectToSignIn = () => {
        if (!email) {
          return;
        }

        router.replace(
          `${ROUTES.provider.singIn}&email=${encodeURIComponent(email)}` as Route,
        );
        toast.error(SIGN_UP_TEXTS.resume.signInRequired);
      };

      if (hasProviderAuthToken()) {
        try {
          const profileData = await authService.getProfile();
          const resumeSlug = getProviderProfileResumeStep(profileData);
          const profileEmail = profileData.email || email;

          if (resumeSlug && profileEmail) {
            const resumeUrl = buildProviderSignupResumeUrl(
              profileEmail,
              resumeSlug,
            );
            const currentUrl = `${window.location.pathname}${window.location.search}`;

            if (currentUrl !== resumeUrl) {
              router.replace(resumeUrl as Route);
            }

            setState({
              isChecking: false,
              isResumeLocked: true,
              profileStep: profileStepSlugToIndex(resumeSlug),
            });
            return;
          }

          const redirectInfo = getProviderRedirectInfo(profileData);
          router.replace(redirectInfo.path as Route);
          return;
        } catch {
          if (
            isProviderSignupProfileStepSlug(stepParam) &&
            hasProviderAuthToken()
          ) {
            setState({
              isChecking: false,
              isResumeLocked: true,
              profileStep: profileStepSlugToIndex(stepParam),
            });
            return;
          }

          if (isProviderSignupProfileStepSlug(stepParam)) {
            redirectToSignIn();
          }

          setState({
            isChecking: false,
            isResumeLocked: false,
            profileStep: null,
          });
          return;
        }
      }

      if (isProviderSignupProfileStepSlug(stepParam) && email) {
        redirectToSignIn();
        setState({
          isChecking: false,
          isResumeLocked: false,
          profileStep: null,
        });
        return;
      }

      if (isProviderSignupProfileStepSlug(stepParam)) {
        setState({
          isChecking: false,
          isResumeLocked: true,
          profileStep: profileStepSlugToIndex(stepParam),
        });
        return;
      }

      setState({
        isChecking: false,
        isResumeLocked: false,
        profileStep: null,
      });
    };

    void resolveGuard();
  }, [emailOverride, emailParam, enabled, router, stepParam]);

  return state;
}
