"use client";

import { Suspense } from "react";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { usePatientSignIn } from "@/hooks/patient/use-patient-signin";
import { ROUTES } from "@/lib/constants/routes";
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
    errorMessage,
    showPassword,
    togglePasswordVisibility,
    router,
  } = usePatientSignIn({
    email,
  });

  return (
    <div className="h-full flex flex-col justify-between min-h-screen py-6">
      <SignInHeader />

      <SignInForm
        email={email || ""}
        register={register}
        errors={errors}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
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
  <div className="h-full flex flex-col justify-between min-h-screen py-6 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center px-8 justify-between w-full">
      <div className="h-8 w-32 bg-muted rounded-md" />
      <div className="h-7 w-24 bg-muted rounded-full" />
    </div>
    {/* Form skeleton */}
    <div className="px-8 md:px-20 w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="h-9 w-64 bg-muted rounded-lg mx-auto" />
        <div className="h-4 w-48 bg-muted rounded-md mx-auto" />
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-4 w-12 bg-muted rounded-md" />
          <div className="h-12 w-full bg-muted rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded-md" />
          <div className="h-12 w-full bg-muted rounded-xl" />
        </div>
      </div>
    </div>
    {/* Footer skeleton */}
    <div className="flex border-t border-border/50 px-8 pt-6 items-center justify-between">
      <div className="h-10 w-24 bg-muted rounded-full" />
      <div className="h-10 w-28 bg-muted rounded-full" />
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
