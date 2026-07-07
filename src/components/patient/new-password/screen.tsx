"use client";

import { Suspense } from "react";
import { usePatientNewPassword } from "@/hooks/patient/new-password/use-new-password";
import {
  NewPasswordHeader,
  NewPasswordForm,
  NewPasswordFooter,
} from "@/components/patient/new-password";

function PatientNewPasswordContent() {
  const {
    register,
    handleSubmit,
    errors,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    router,
    isSubmitting,
  } = usePatientNewPassword();

  return (
    <div className="animate-in fade-in zoom-in-95 flex h-full min-h-screen w-full flex-col justify-between px-6 py-6 duration-700 sm:px-8 md:px-12 lg:px-16">
      <NewPasswordHeader />

      <div className="flex flex-1 items-center justify-center py-12">
        <NewPasswordForm
          register={register}
          errors={errors}
          showPassword={showPassword}
          onTogglePassword={togglePasswordVisibility}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>

      <NewPasswordFooter
        onBack={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export function PatientNewPasswordScreen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientNewPasswordContent />
    </Suspense>
  );
}
