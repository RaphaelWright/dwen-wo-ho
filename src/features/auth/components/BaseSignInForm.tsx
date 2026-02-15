import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import Link from "next/link";
import type { Route } from "next";
import { Loader2 } from "lucide-react";

interface BaseSignInFormProps {
  role: "patient" | "provider";
  email: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onBack: () => void;
  onForgotPassword?: () => void;
  onRecoverAccount?: () => void;
  isLoading: boolean;
  isRecovering?: boolean;
  errorMessage?: string;
  forgotPasswordHref?: Route;
}

export const BaseSignInForm = ({
  role,
  email,
  register,
  errors,
  onSubmit,
  onBack,
  onForgotPassword,
  onRecoverAccount,
  isLoading,
  isRecovering,
  errorMessage,
  forgotPasswordHref,
}: BaseSignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full flex flex-col justify-between min-h-screen py-8">
      <div className="flex items-center px-8 justify-between w-full">
        <Logo />
        <p className="font-bold text-3xl">
          <span className="text-sm font-normal">for </span>
          {role === "patient" ? "Patients" : "Providers"}
        </p>
      </div>

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
            {role === "patient" && (
              <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
                Email
              </label>
            )}
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 font-semibold"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          {role === "patient" ? (
            <h1 className="text-xl md:text-2xl font-bold text-center text-[#955aa4]">
              Don&apos;t remember password?{" "}
              {forgotPasswordHref && (
                <Link href={forgotPasswordHref} className="text-[#ed1c24]">
                  Recover account &gt;
                </Link>
              )}
            </h1>
          ) : (
            <div className="flex justify-center items-center gap-2 text-lg">
              <span className="text-gray-500 font-semibold">
                Don&apos;t remember password?
              </span>
              <button
                type="button"
                onClick={onRecoverAccount}
                disabled={isRecovering}
                className="text-[#ed1c24] font-bold hover:underline disabled:opacity-50"
              >
                {isRecovering ? "Sending email..." : "Recover Account >"}
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={onBack}
          className="rounded-full px-6 py-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase hover:bg-gray-50"
        >
          Back
        </Button>
        <button
          form="login-form"
          type="submit"
          disabled={isLoading || Object.keys(errors).length > 0}
          className={`text-xl px-8 py-3 border-4 font-bold rounded-md flex items-center gap-2 transition-colors ${
            isLoading || Object.keys(errors).length > 0
              ? "border-gray-400 text-gray-400 bg-gray-300 cursor-not-allowed"
              : "border-[#955aa4] text-white bg-[#955aa4]/60 hover:bg-[#955aa4]/80"
          }`}
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};
