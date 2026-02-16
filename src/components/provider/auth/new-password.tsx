"use client";

import { Logo } from "@/components/shared/Logo";
import { ROUTES } from "@/lib/constants/routes";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DevTool } from "@hookform/devtools";
import { recoverSteps } from "@/lib/utils";
import Stepper from "@/components/miscellaneous/stepper";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/provider/auth/new-password";
import { Input } from "@/components/ui/input";
import { useNewPassword } from "@/hooks/components/provider/auth/use-new-password";

const NewPasswordContent = () => {
  const {
    showPassword,
    setShowPassword,
    errorMessage,
    control,
    register,
    handleSubmit,
    errors,
    onSubmit,
    router,
    resetPasswordMutation,
  } = useNewPassword();

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 pt-5 justify-between w-full">
        <Logo />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-gray-300 text-[#ed1c24] rounded-md px-6 py-1"
        >
          {NEW_PASSWORD_TEXTS.header.signIn}
        </Link>
      </div>
      <form
        id="login-form"
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("Form Validation Errors:", errors),
        )}
        className="px-22"
      >
        <h1 className="text-5xl text-center font-extrabold">
          {NEW_PASSWORD_TEXTS.form.title}
        </h1>
        <div className="my-16 space-y-5">
          <div className="relative mt-4 flex flex-col">
            <Input
              {...register("password")}
              placeholder={NEW_PASSWORD_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 text-xl text-gray-600 p-4 bg-gray-200/50 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
              variant="ghost"
            >
              {!showPassword ? (
                <span>{NEW_PASSWORD_TEXTS.form.show}</span>
              ) : (
                <span>{NEW_PASSWORD_TEXTS.form.hide}</span>
              )}
            </Button>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="relative mt-10 flex flex-col">
            <Input
              {...register("confirmPassword")}
              placeholder={NEW_PASSWORD_TEXTS.form.repeatPasswordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 text-xl text-gray-600 p-4 bg-gray-200/50 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
              variant="ghost"
            >
              {!showPassword ? (
                <span>{NEW_PASSWORD_TEXTS.form.show}</span>
              ) : (
                <span>{NEW_PASSWORD_TEXTS.form.hide}</span>
              )}
            </Button>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </form>
      <div className="flex border-t border-gray-500 px-10 p-8 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          {NEW_PASSWORD_TEXTS.form.back}
        </Button>
        <Stepper steps={recoverSteps} step="New Password" />
        <Input
          form="login-form"
          type="submit"
          value={NEW_PASSWORD_TEXTS.form.done}
          className="text-xl px-7 py-1 border-4 font-bold border-[#955aa4] rounded-full text-white bg-[#955aa4]/60 w-auto cursor-pointer"
        />
      </div>
      <DevTool control={control} />
      <LoadingOverlay
        isVisible={resetPasswordMutation.isPending}
        text={NEW_PASSWORD_TEXTS.toasts.loading}
      />
    </div>
  );
};

const NewPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordContent />
    </Suspense>
  );
};

export default NewPassword;
