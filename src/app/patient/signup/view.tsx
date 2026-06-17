"use client";

import { Suspense } from "react";
import { DevTool } from "@hookform/devtools";
import { usePatientSignUp } from "@/hooks/patient/signup/use-signup";
import {
  SignUpHeader,
  SignUpForm,
  SignUpFooter,
} from "@/components/patient/signup";

const SignUpContent = () => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    router,
    email,
  } = usePatientSignUp();

  return (
    <div className="flex h-full flex-col justify-between">
      <SignUpHeader />

      <SignUpForm
        email={email || ""}
        register={register}
        errors={errors}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        onSubmit={handleSubmit(onSubmit)}
      />

      <SignUpFooter onBack={() => router.back()} />

      <DevTool control={control} />
    </div>
  );
};

const SignUpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUpPage;
