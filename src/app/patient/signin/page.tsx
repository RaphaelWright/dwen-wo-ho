"use client";

import { Suspense } from "react";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { usePatientSignIn } from "@/hooks/patient/usePatientSignIn";
import { ROUTES } from "@/lib/constants/routes";
import {
  SignInHeader,
  SignInForm,
  SignInFooter,
} from "@/features/patient/components/signin";

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
    <div className="h-full flex flex-col justify-between min-h-screen py-8">
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

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
