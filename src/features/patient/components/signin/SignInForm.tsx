"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import Link from "next/link";
import type { Route } from "next";
import { PatientSignInFormData } from "@/hooks/patient/usePatientSignIn";

interface SignInFormProps {
  email: string;
  register: UseFormRegister<PatientSignInFormData>;
  errors: FieldErrors<PatientSignInFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errorMessage?: string;
  forgotPasswordHref?: Route;
}

export function SignInForm({
  email,
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
  errorMessage,
  forgotPasswordHref,
}: SignInFormProps) {
  return (
    <form
      id="login-form"
      onSubmit={onSubmit}
      className="px-12 md:px-24 w-full max-w-4xl mx-auto"
    >
      <h1 className="text-5xl font-extrabold text-center mb-16">
        Sign in to your Account
      </h1>

      <div className="my-16 space-y-6">
        <div className="flex flex-col">
          <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
            Email
          </label>
          <input
            {...register("email")}
            value={email}
            disabled
            className={`font-bold w-full rounded-xl border-4 text-xl md:text-2xl text-gray-500 p-4 bg-gray-200/50 border-transparent`}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg md:text-2xl font-bold text-gray-500 pl-4 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              placeholder="********"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.password
                  ? "border-red-500 text-red-500"
                  : "border-[#2bb673] text-gray-500"
              } text-xl md:text-2xl p-4 bg-gray-200/50 outline-none`}
              autoFocus
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 font-semibold"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-center font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="text-center mt-6">
        <h1 className="text-xl md:text-2xl font-bold text-center text-[#955aa4]">
          Don&apos;t remember password?{" "}
          {forgotPasswordHref && (
            <Link href={forgotPasswordHref} className="text-[#ed1c24]">
              Recover account &gt;
            </Link>
          )}
        </h1>
      </div>
    </form>
  );
}
