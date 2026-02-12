"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignUpFormData } from "@/hooks/patient/usePatientNewPassword";

interface NewPasswordFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function NewPasswordForm({
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
}: NewPasswordFormProps) {
  return (
    <form id="login-form" onSubmit={onSubmit} className="px-12">
      <h1 className="text-6xl text-center font-extrabold">
        Create New Password
      </h1>
      <div className="my-16 space-y-5">
        <div className="relative mt-4 flex flex-col">
          <input
            {...register("password")}
            placeholder="Password (6 or more characters)"
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors?.password?.message ? "border-red-500" : "border-green-600"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
          >
            {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
          </button>
        </div>
        <div className="relative mt-4 flex flex-col">
          <input
            {...register("repeatPassword")}
            placeholder="Repeat Password"
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors?.repeatPassword?.message
                ? "border-red-500"
                : "border-green-600"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
          >
            {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
          </button>
        </div>
      </div>
    </form>
  );
}
