"use client";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/components/shared/auth-flow";
import Stepper from "@/components/miscellaneous/stepper";
import { useProviderPassword } from "@/hooks/provider/password/use-password";

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
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full items-center justify-between px-8">
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
            <label
              htmlFor="password"
              className="mb-2 pl-4 text-2xl font-bold text-gray-500"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              placeholder="Enter your password (6 or more characters)"
              type={showPassword ? "text" : "password"}
              className={`w-full rounded-xl border-4 font-bold ${
                errors?.password?.message
                  ? "border-red-500"
                  : "border-green-600"
              } bg-gray-200/50 p-4 text-2xl text-gray-500`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-10 right-4 -translate-y-1/2 transform"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.password?.message && (
              <p className="text-destructive mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative flex flex-col">
            <label
              htmlFor="confirm-password"
              className="mb-2 pl-4 text-2xl font-bold text-gray-500"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full rounded-xl border-4 font-bold ${
                errors?.confirmPassword?.message
                  ? "border-red-500"
                  : "border-green-600"
              } bg-gray-200/50 p-4 text-2xl text-gray-500`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute top-10 right-4 -translate-y-1/2 transform"
            >
              {!showConfirmPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
            {errors?.confirmPassword?.message && (
              <p className="text-destructive mt-1 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between border-t border-gray-500 px-10 pt-10">
        <Button
          onClick={() => router.back()}
          className="bg-background text-primary border-primary rounded-full border-4 px-6 text-xl font-bold uppercase"
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
          className={`rounded-md border-4 px-6 py-2 text-xl font-bold ${
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
