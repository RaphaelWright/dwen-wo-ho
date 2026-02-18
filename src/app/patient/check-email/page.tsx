"use client";

import { usePatientCheckEmail } from "@/hooks/patient/usePatientCheckEmail";
import {
  CheckEmailHeader,
  CheckEmailForm,
  CheckEmailInfo,
} from "@/components/patient/check-email";

const CheckEmail = () => {
  const {
    register,
    handleSubmit,
    errors,
    isValidEmail,
    handleEmailChange,
    onSubmit,
  } = usePatientCheckEmail();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-24 py-8 md:py-12">
      <CheckEmailHeader />

      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 lg:space-y-12 px-4 md:px-6 max-w-4xl mx-auto w-full mt-16 md:mt-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-medium leading-tight">
          Enter your email to <span className="text-[#955aa4]">Sign In</span> or{" "}
          <span className="text-[#955aa4]">Sign Up</span> as a Patient.
        </h1>

        <CheckEmailForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isValidEmail={isValidEmail}
          onEmailChange={handleEmailChange}
        />

        <CheckEmailInfo />
      </div>
    </div>
  );
};

export default CheckEmail;
