"use client";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { signUpSteps } from "@/lib/utils";
import Stepper from "@/components/miscellaneous/stepper";
import { useProviderPassword } from "@/hooks/provider/use-provider-password";

const PasswordSetup = () => {
  const {
    form: {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    },
    onSubmit,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    signupMutation,
    router,
  } = useProviderPassword();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <Logo />
        <p className="font-bold">
          for <span className="text-4xl">Providers</span>
        </p>
      </div>

      <form
        id="password-form"
        onSubmit={handleSubmit(onSubmit)}
        className="px-12"
      >
        <h1 className="text-5xl font-extrabold">Set Your Password</h1>
        <div className="my-16 space-y-5">
          <div className="relative flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
              Password
            </label>
            <input
              {...register("password")}
              placeholder="Enter your password (6 or more characters)"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.password?.message
                  ? "border-red-500"
                  : "border-green-600"
              } text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-10 right-4 transform -translate-y-1/2"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.password?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative flex flex-col">
            <label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.confirmPassword?.message
                  ? "border-red-500"
                  : "border-green-600"
              } text-2xl text-gray-500 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute top-10 right-4 transform -translate-y-1/2"
            >
              {!showConfirmPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.confirmPassword?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

      </form>

      <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase"
        >
          Back
        </Button>
        <Stepper steps={signUpSteps} step="Profile" />
        <LoadingButton
          form="password-form"
          type="submit"
          loading={signupMutation.isPending}
          loadingText="Setting Password..."
          disabled={!password || !confirmPassword}
          className={`text-xl px-6 py-2 border-4 font-bold rounded-md ${
            password && confirmPassword && !signupMutation.isPending
              ? "border-primary text-primary-foreground bg-primary hover:bg-primary/90"
              : "border-uted text-muted-foreground bg-muted cursor-not-allowed"
          }`}
        >
          Next
        </LoadingButton>
      </div>
    </div>
  );
};

export default PasswordSetup;
