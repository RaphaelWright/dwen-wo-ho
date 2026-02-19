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
    <div className="w-full h-full min-h-screen flex flex-col justify-between px-8 md:px-12 lg:px-16 py-6 animate-in fade-in zoom-in-95 duration-700">
      {/* Header */}
      <CheckEmailHeader />

      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold leading-tight text-foreground tracking-tight flex flex-col gap-1">
          <span>
            Enter your email to{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
              Sign In
            </span>
          </span>
          <span className="text-muted-foreground/80 text-xl md:text-2xl font-medium">
            or
          </span>
          <span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
              Sign Up
            </span>{" "}
            as a Patient.
          </span>
        </h1>

        <CheckEmailForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isValidEmail={isValidEmail}
          onEmailChange={handleEmailChange}
        />
      </div>

      {/* Footer */}
      <CheckEmailInfo />
    </div>
  );
};

export default CheckEmail;
