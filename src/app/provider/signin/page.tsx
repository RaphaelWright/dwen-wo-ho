"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ROUTES } from "@/lib/constants/routes";
import PendingVerificationModal from "@/components/modals/pending-verification";
import { useProviderSignIn } from "@/hooks/provider/use-provider-signin";

const SignInContent = () => {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
    showPassword,
    togglePasswordVisibility,
    password,
    handlePasswordChange,
    isLoading,
    errorMessage,
    showPendingModal,
    setShowPendingModal,
    userInfo,
    email,
    router,
  } = useProviderSignIn();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6">
        <Logo />
        <button className="bg-muted text-destructive rounded-full px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors">
          Switch to Patients
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to your Account
            </h1>
            <p className="text-gray-600">
              Welcome back! Please sign in to continue.
            </p>
          </div>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              value={email as string}
              placeholder={email as string}
              disabled
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg text-gray-500 bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 pr-16 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  errors?.password?.message
                    ? "border-destructive bg-destructive/10"
                    : "border-gray-300 bg-background hover:border-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
              >
                {!showPassword ? "SHOW" : "HIDE"}
              </button>
            </div>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-center text-sm font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              href={`${ROUTES.provider.verifyPasswordReset}?email=${email}`}
              className="text-primary hover:text-primary/90 text-sm font-medium transition-colors"
            >
              Don&apos;t remember your password? Recover account →
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 items-center justify-between space-y-4 sm:space-y-0">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-background text-primary text-sm sm:text-base lg:text-xl font-bold border-primary uppercase w-full sm:w-auto"
        >
          Back
        </Button>
        <LoadingButton
          form="login-form"
          type="submit"
          loading={isLoading}
          loadingText="Signing In..."
          disabled={!password.trim()}
          className={`text-sm sm:text-base lg:text-xl px-3 sm:px-4 lg:px-6 py-2 border-2 sm:border-4 font-bold rounded-md w-full sm:w-auto ${
            !password.trim() || isLoading
              ? "border-muted text-muted-foreground bg-muted-foreground/20 cursor-not-allowed"
              : "border-primary text-primary-foreground bg-primary/60 hover:bg-primary/80"
          }`}
        >
          Sign In
        </LoadingButton>
      </div>

      {/* Pending Verification Modal */}
      <PendingVerificationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

const SignIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignIn;
