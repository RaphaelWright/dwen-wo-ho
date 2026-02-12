"use client";

import { Suspense } from "react";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { BaseSignInForm } from "@/features/auth/components/BaseSignInForm";
import { usePatientSignIn } from "@/features/auth/hooks/usePatientSignIn";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const SignInContent = () => {
  const router = useRouter();
  const email = useGetSearchParams("email");

  const { register, errors, onSubmit, isLoading, errorMessage } =
    usePatientSignIn({
      email,
    });

  return (
    <BaseSignInForm
      role="patient"
      email={email || ""}
      register={register}
      errors={errors}
      onSubmit={onSubmit}
      onBack={() => router.back()}
      isLoading={isLoading}
      errorMessage={errorMessage}
      forgotPasswordHref={`${ROUTES.patient.verifyPasswordReset}?email=${email}`}
    />
  );
};

const SignIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignIn;
