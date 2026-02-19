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
    <div className="w-full px-8 md:px-12 lg:px-16 animate-in fade-in zoom-in-95 duration-700 space-y-20 my-4">
      <CheckEmailHeader />
      <div className="space-y-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold leading-tight text-foreground tracking-tight drop-shadow-sm">
          Enter your email to{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
            Sign In
          </span>{" "}
          or{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
            Sign Up
          </span>{" "}
          as a Patient.
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
