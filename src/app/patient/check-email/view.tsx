"use client";

import { usePatientCheckEmail } from "@/hooks/patient/use-patient-check-email";
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
    <div className="animate-in fade-in zoom-in-95 flex h-full min-h-screen w-full flex-col justify-between px-8 py-6 duration-700 md:px-12 lg:px-16">
      {/* Header */}
      <CheckEmailHeader />

      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-foreground flex flex-col gap-1 text-center text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl">
          <span>
            Enter your email to{" "}
            <span className="from-primary animate-gradient-x bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Sign In
            </span>
          </span>
          <span className="text-muted-foreground/80 text-xl font-medium md:text-2xl">
            or
          </span>
          <span>
            <span className="from-primary animate-gradient-x bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
