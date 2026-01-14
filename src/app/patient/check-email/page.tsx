/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import JustGoHealth from "@/components/logo-purple";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

const FormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

const CheckEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const watchedEmail = watch("email");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(emailRegex.test(value));
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    router.push(`${ROUTES.patient.singIn}?email=${values.email}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-24 py-8 md:py-12">
      <div className="absolute flex top-4 md:top-8 items-center px-4 md:px-8 justify-between w-full">
        <JustGoHealth />
        <Link
          href={ROUTES.provider.checkEmail}
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-gray-300 text-[#ed1c24] rounded-full px-3 md:px-4 py-1 md:py-2"
        >
          Switch to Provider
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 lg:space-y-12 px-4 md:px-6 max-w-4xl mx-auto w-full mt-16 md:mt-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-medium leading-tight">
          Enter your email to <span className="text-[#955aa4]">Sign In</span> or{" "}
          <span className="text-[#955aa4]">Sign Up</span> as a Patient.
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <div className="flex flex-col">
            <label className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-500 pl-2 md:pl-4 mb-2">
              Email
            </label>
            <div className="relative flex">
              <input
                {...register("email")}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                className={`font-bold w-full rounded-l-xl border-4 border-r-0 ${
                  errors?.email?.message ? "border-red-500" : "border-green-600"
                } text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 p-3 md:p-4 bg-gray-200/50 focus:outline-none`}
              />
              <Button
                type="submit"
                variant="ghost"
                disabled={!isValidEmail}
                className={`rounded-l-none rounded-r-xl border-4 border-l-0 px-3 md:px-4 h-auto ${
                  isValidEmail 
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                    : "bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed"
                }`}
              >
                <Image 
                  src="/arrow-right.svg" 
                  alt="Arrow right" 
                  width={32} 
                  height={32}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                />
              </Button>
            </div>
          </div>
        </form>
        <div className="w-full max-w-3xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#955aa4] leading-tight">
            JustGo Health Patients
          </h1>
          <h2 className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-center">
            Great doctors, psychologists, and mentors are ready to guide you
            personally. Hurry up!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
