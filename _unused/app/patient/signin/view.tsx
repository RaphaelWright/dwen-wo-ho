"use client";

import { Suspense } from "react";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { usePatientSignIn } from "@/hooks/patient/signin/use-signin";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  SignInHeader,
  SignInForm,
  SignInFooter,
} from "@/components/patient/signin";

const SignInContent = () => {
  const email = useGetSearchParams("email");

  const {
    register,
    errors,
    onSubmit,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    router,
  } = usePatientSignIn({
    email,
  });

  return (
    <div className="flex h-full min-h-screen flex-col justify-between py-6">
      <SignInHeader />

      <SignInForm
        email={email || ""}
        register={register}
        errors={errors}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        onSubmit={onSubmit}
        forgotPasswordHref={`${ROUTES.patient.verifyPasswordReset}?email=${email}`}
      />

      <SignInFooter
        onBack={() => router.back()}
        isLoading={isLoading}
        errors={errors}
      />
    </div>
  );
};

const SignInSkeleton = () => (
  <div className="flex h-full min-h-screen animate-pulse flex-col justify-between py-6">
    {/* Header skeleton */}
    <div className="flex w-full items-center justify-between px-8">
      <div className="bg-muted h-8 w-32 rounded-md" />
      <div className="bg-muted h-7 w-24 rounded-full" />
    </div>
    {/* Form skeleton */}
    <div className="mx-auto w-full max-w-2xl space-y-6 px-8 md:px-20">
      <div className="space-y-2 text-center">
        <div className="bg-muted mx-auto h-9 w-64 rounded-lg" />
        <div className="bg-muted mx-auto h-4 w-48 rounded-md" />
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="bg-muted h-4 w-12 rounded-md" />
          <div className="bg-muted h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-md" />
          <div className="bg-muted h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
    {/* Footer skeleton */}
    <div className="border-border/50 flex items-center justify-between border-t px-8 pt-6">
      <div className="bg-muted h-10 w-24 rounded-full" />
      <div className="bg-muted h-10 w-28 rounded-full" />
    </div>
  </div>
);

const SignInPage = () => {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
