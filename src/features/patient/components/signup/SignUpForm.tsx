"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { SignUpFormData } from "@/hooks/patient/usePatientSignUp";

interface SignUpFormProps {
  email: string;
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function SignUpForm({
  email,
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form id="login-form" onSubmit={onSubmit} className="px-12">
      <h1 className="text-5xl text-center font-extrabold">
        Create Your Account
      </h1>
      <div className="my-16 space-y-5">
        <input
          {...register("email")}
          value={email}
          placeholder={email}
          disabled
          className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50 border-transparent`}
        />

        <div className="flex flex-col space-y-2">
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className={`font-bold w-full rounded-xl border-4 ${
              errors.fullName ? "border-red-500" : "border-transparent"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm ml-4">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <input
            {...register("phoneNumber")}
            type="tel"
            placeholder="Phone Number"
            className={`font-bold w-full rounded-xl border-4 ${
              errors.phoneNumber ? "border-red-500" : "border-transparent"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm ml-4">
              {errors.phoneNumber.message}
            </span>
          )}
          <h2 className="ml-4 text-gray-500 text-lg md:text-3xl font-bold">
            This will only be used for emergencies
          </h2>
        </div>

        <div className="relative mt-4 flex flex-col space-y-2">
          <input
            {...register("password")}
            placeholder="Password (6 or more characters)"
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors.password ? "border-red-500" : "border-green-600"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-[34px] right-4 transform -translate-y-1/2 text-gray-500 font-semibold"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
          {errors.password && (
            <span className="text-red-500 text-sm ml-4">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-gray-500">
        <Checkbox className="mr-4 rounded-none border-black" />
        Agree to{" "}
        <Link href="/" className="text-[#ed1c24]">
          Terms & Conditions
        </Link>
      </h1>
    </form>
  );
}
