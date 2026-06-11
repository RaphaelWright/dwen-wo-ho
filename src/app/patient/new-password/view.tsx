"use client";

import { Suspense } from "react";
// import { DevTool } from "@hookform/devtools"; // Commented out for production feel
import { usePatientNewPassword } from "@/hooks/patient/use-patient-new-password";
import {
  NewPasswordHeader,
  NewPasswordForm,
  NewPasswordFooter,
} from "@/components/patient/new-password";

const NewPasswordContent = () => {
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
    <div className="w-full h-full min-h-screen flex flex-col justify-between px-6 sm:px-8 md:px-12 lg:px-16 py-6 animate-in fade-in zoom-in-95 duration-700">
      <NewPasswordHeader />

      <div className="flex-1 flex items-center justify-center py-12">
        <NewPasswordForm
          register={register}
          errors={errors}
          showPassword={showPassword}
          onTogglePassword={togglePasswordVisibility}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>

      <NewPasswordFooter onBack={() => router.back()} isSubmitting={isSubmitting} />

      {/* <DevTool control={control} /> */}
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
