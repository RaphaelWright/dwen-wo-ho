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
import { ROUTES } from "@/lib/constants/routes";
import { useCreateAccount } from "@/hooks/components/provider/auth/signup/use-create-account";
import { Label } from "@/components/ui/label";
import PasswordStrengthIndicator from "@/components/shared/password-strength-indicator";

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
    fullNameRegister,
    handleFullNameChange,
    handleFullNameBlur,
    isTitleSelectOpen,
    setIsTitleSelectOpen,
    email,
    title,
    fullName,
    password,
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
        className="w-full max-w-lg mx-auto space-y-8 px-8 animate-in fade-in slide-in-from-bottom-8 duration-700"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {SIGN_UP_TEXTS.createAccount.title}
          </h1>
          <p className="text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Email<span className="text-destructive">*</span></Label>
            <Input
              {...register("email")}
              value={email}
              placeholder={SIGN_UP_TEXTS.createAccount.emailPlaceholder}
              disabled
              className="h-12 bg-muted text-lg font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-4">
           <Label>{SIGN_UP_TEXTS.createAccount.professionalTitle}<span className="text-destructive">*</span></Label>
            <FormSelect
              value={title}
              onValueChange={handleTitleChange}
              placeholder="Select your professional title"
              className="w-full h-12 rounded-lg border-input"
              open={isTitleSelectOpen}
              onOpenChange={setIsTitleSelectOpen}
            >
              <div className="py-1">
                {PROFESSIONAL_TITLES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item.split(" ")[0]}
                    className="cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </div>
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Label>Full Name<span className="text-destructive">*</span></Label>
            <Input
              {...fullNameRegister}
              onChange={handleFullNameChange}
              onBlur={handleFullNameBlur}
              placeholder={SIGN_UP_TEXTS.createAccount.fullNamePlaceholder}
              className={`h-12 text-lg transition-all duration-200 ${
                errors?.fullName
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-input focus-visible:ring-primary/30"
              }`}
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="on"
              spellCheck="true"
              maxLength={100}
              minLength={3}
              required
              autoSave="on"
            />
            {fullName && title && (
              <p className="text-center text-muted-foreground text-sm font-medium mt-2 animate-in fade-in">
                {SIGN_UP_TEXTS.createAccount.youAre}{" "}
                <span className="text-primary font-bold">
                  {title} {fullName}
                </span>
              </p>
            )}
            {errors?.fullName && (
              <p className="text-sm text-destructive font-medium pl-1">
                {errors.fullName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Password<span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={SIGN_UP_TEXTS.createAccount.passwordPlaceholder}
                className={`h-12 pl-4 pr-16 text-lg transition-all duration-200 ${
                  errors?.password
                    && "border-destructive focus-visible:ring-destructive/30"
                }`}
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                variant="ghost"
                size="sm"
              >
                {showPassword ? (
                  <span className="text-xs font-semibold">HIDE</span>
                ) : (
                  <span className="text-xs font-semibold">SHOW</span>
                )}
              </Button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
            {errors?.password && (
              <p className="text-sm text-destructive font-medium pl-1">
                {errors.password.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
            <p className="text-destructive text-sm font-medium">
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
            className="w-5 h-5 border-2 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
          />
          <p className="text-sm font-medium text-muted-foreground">
            {SIGN_UP_TEXTS.createAccount.agreeTo}{" "}
            <Link
              href={ROUTES.public.landing}
              className="text-primary hover:underline transition-colors"
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
