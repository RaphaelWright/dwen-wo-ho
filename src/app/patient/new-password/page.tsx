"use client";

import { Suspense } from "react";
import { DevTool } from "@hookform/devtools";
import { usePatientNewPassword } from "@/hooks/patient/usePatientNewPassword";
import {
  NewPasswordHeader,
  NewPasswordForm,
  NewPasswordFooter,
} from "@/components/patient/new-password";

const NewPasswordContent = () => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    router,
  } = usePatientNewPassword();

  return (
    <div className="h-full flex flex-col justify-between">
      <NewPasswordHeader />

      <NewPasswordForm
        register={register}
        errors={errors}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        onSubmit={handleSubmit(onSubmit)}
      />

      <NewPasswordFooter onBack={() => router.back()} />

      <DevTool control={control} />
    </div>
  );
};

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordContent />
    </Suspense>
  );
};

export default NewPasswordPage;
