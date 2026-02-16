"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { CreateAccountProps } from "@/lib/types/provider/auth";
import {
  SIGN_UP_TEXTS,
  PROFESSIONAL_TITLES,
} from "@/lib/constants/components/provider/auth/signup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateAccount } from "@/hooks/components/provider/auth/signup/use-create-account";

const CreateAccount = (props: CreateAccountProps) => {
  const { agreedToTerms, onAgreedToTermsChange } = props;
  const {
    errorMessage,
    showPassword,
    setShowPassword,
    signupMutation,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleTitleChange,
    email,
    title,
    fullName,
  } = useCreateAccount(props);

  return (
    <>
      <LoadingOverlay
        text={SIGN_UP_TEXTS.createAccount.verificationText}
        isVisible={signupMutation.isPending}
      />
      <form
        id="create-account-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto space-y-4 px-11"
      >
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black mb-1">
            {SIGN_UP_TEXTS.createAccount.title}
          </h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <Input
            {...register("email")}
            value={email}
            placeholder={SIGN_UP_TEXTS.createAccount.emailPlaceholder}
            disabled
            className="font-bold w-full rounded-xl text-lg text-gray-500 p-3 bg-gray-200/50 outline-none border-none"
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-black">
              {SIGN_UP_TEXTS.createAccount.professionalTitle}
            </h2>
            <FormSelect
              value={title}
              onValueChange={handleTitleChange}
              placeholder={
                SIGN_UP_TEXTS.createAccount.professionalTitlePlaceholder
              }
              className="w-full! rounded-full! text-lg! text-gray-500! p-3! bg-gray-200/50! border-2! border-gray-400! outline-none h-auto! font-bold"
            >
              <div className="py-1">
                {PROFESSIONAL_TITLES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item.split(" ")[0]}
                    className="px-4 py-3 text-lg font-medium text-gray-500 data-[state=checked]:bg-[#ed1c24] data-[state=checked]:text-white focus:bg-[#ed1c24] focus:text-white cursor-pointer rounded-none"
                  >
                    {item}
                  </SelectItem>
                ))}
              </div>
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Input
              {...register("fullName")}
              placeholder={SIGN_UP_TEXTS.createAccount.fullNamePlaceholder}
              className={`font-bold w-full rounded-xl text-lg border-2 text-gray-500 p-3 bg-gray-200/50 outline-none focus:border-[#2bb673] transition-colors ${
                errors?.fullName ? "border-red-500" : "border-gray-400"
              }`}
            />
            {fullName && title && (
              <p className="text-center text-gray-500 text-lg font-bold mt-2">
                {SIGN_UP_TEXTS.createAccount.youAre}{" "}
                <span className="text-[#955aa4]">
                  {title} {fullName}
                </span>
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder={SIGN_UP_TEXTS.createAccount.passwordPlaceholder}
              className={`font-bold w-full rounded-xl text-lg text-gray-500 p-3 bg-gray-200/50 outline-none border-2 border-gray-400 focus:border-[#2bb673] transition-colors ${
                errors?.password ? "border-red-500" : "border-gray-400"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xs uppercase hover:text-gray-700 transition-colors"
              variant="ghost"
            >
              {showPassword
                ? SIGN_UP_TEXTS.createAccount.hide
                : SIGN_UP_TEXTS.createAccount.show}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) =>
              onAgreedToTermsChange(checked === true)
            }
            className="w-6 h-6 rounded border-2 border-gray-400 data-[state=checked]:bg-transparent data-[state=checked]:text-black"
          />
          <p className="text-lg font-bold text-gray-500">
            {SIGN_UP_TEXTS.createAccount.agreeTo}{" "}
            <Link
              href="/"
              className="text-[#ed1c24] hover:underline transition-colors"
            >
              {SIGN_UP_TEXTS.createAccount.terms}
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default CreateAccount;
