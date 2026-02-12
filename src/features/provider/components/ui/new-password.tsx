"use client";

import { Logo } from "@/components/shared/Logo";
import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DevTool } from "@hookform/devtools";
import { toast } from "sonner";
import { recoverSteps } from "@/lib/utils";
import Stepper from "@/components/stepper";
import { api } from "@/lib/api";
import { setUserType } from "@/lib/utils/getUserType";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import LoadingOverlay from "@/components/ui/loading-overlay";

const SignUpSchema = z.object({
  email: z.email().min(1, { message: "Please enter your email" }),
  password: z.string().min(6, { message: "Please enter your password" }),
  repeatPassword: z.string().min(6, { message: "Please enter your password" }),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const getCleanErrorMessage = (error: any): string => {
  let message = "An unexpected error occurred.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  // Try to parse if it looks like a JSON string
  if (typeof message === "string" && message.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.message) return parsed.message;
      if (parsed.error) return parsed.error;
    } catch {
      // Not JSON, continue with original message
    }
  }

  return message;
};

const NewPasswordContent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const email = useGetSearchParams("email");
  const router = useRouter();
  const { resetPasswordMutation } = useAuthQuery();
  /* const [isLoading, setIsLoading] = useState<boolean>(false); */

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.provider.checkEmail);
      return;
    }

    // Check if recovery token exists, otherwise redirect to verify step to prevent 401
    const storedToken = localStorage.getItem("recoveryToken");
    if (!storedToken) {
      // Keep this toast as it's a redirect/session issue, not a form submission error
      toast.error("Session expired or invalid. Please verify code again.");
      router.push(`${ROUTES.provider.verifyPasswordReset}?email=${email}`);
    }
  }, [email, router]);

  const {
    control,
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email,
      repeatPassword: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    setErrorMessage("");
    try {
      const storedToken = localStorage.getItem("recoveryToken");

      const response = await resetPasswordMutation.mutateAsync({
        password: values.password,
        confirmPassword: values.repeatPassword,
        token: storedToken || undefined,
      });

      if (response.success) {
        // Clear the temporary recovery token
        localStorage.removeItem("recoveryToken");

        // Auto sign-in after password reset
        const token = response.data?.token;
        const userData = response.data?.userData || response.data;

        if (token) {
          localStorage.setItem("token", token);
          if (userData?.userRole === "ROLE_CURATOR") {
            localStorage.setItem("curatorToken", token);
            setUserType("curator");
          } else {
            setUserType("provider");
          }
        }

        // Store refresh token if available
        const refreshTokenValue = response.data?.refreshToken;
        if (refreshTokenValue) {
          localStorage.setItem("refreshToken", refreshTokenValue);
        }

        toast.success("Password changed successfully");

        // Redirect based on application status
        if (userData?.applicationStatus === "APPROVED") {
          router.push(ROUTES.provider.profile);
        } else {
          router.push(ROUTES.provider.home);
        }
      } else {
        setErrorMessage(getCleanErrorMessage(response.message || "Password reset failed"));
      }
    } catch (error) {
      setErrorMessage(getCleanErrorMessage(error));
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 pt-5 justify-between w-full">
        <Logo />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-gray-300 text-[#ed1c24] rounded-md px-6 py-1"
        >
          Sign in
        </Link>
      </div>
      <form id="login-form" onSubmit={handleSubmit(onSubmit, (errors) => console.log("Form Validation Errors:", errors))} className="px-22">
        <h1 className="text-5xl text-center font-extrabold">
          Create New Password
        </h1>
        <div className="my-16 space-y-5">
          <div className="relative mt-4 flex flex-col">
            <input
              {...register("password")}
              placeholder="Password (6 or more characters)"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 text-xl text-gray-600 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
          </div>
          <div className="relative mt-10 flex flex-col">
            <input
              {...register("repeatPassword")}
              placeholder="Repeat Password"
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 text-xl text-gray-600 p-4 bg-gray-200/50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
            >
              {!showPassword ? <span>SHOW</span> : <span>HIDE</span>}
            </button>
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
          Back
        </Button>
        <Stepper steps={recoverSteps} step="New Password" />
        <input
          form="login-form"
          type="submit"
          value="DONE"
          className="text-xl px-7 py-1 border-4 font-bold border-[#955aa4] rounded-full text-white bg-[#955aa4]/60"
        />
      </div>
      <DevTool control={control} />
      <LoadingOverlay isVisible={resetPasswordMutation.isPending} text="Updating password..." />
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

