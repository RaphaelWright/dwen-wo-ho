import { Logo } from "@/components/shared/Logo";
import { useState, useEffect } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { ROUTES } from "@/lib/constants/routes";
import { ProviderEmailFormData } from "@/lib/schemas/provider-auth-schema";
import Link from "next/link";
import { useProviderCheckEmail } from "@/hooks/provider/use-provider-check-email";
import { CheckEmailProps } from "@/lib/types/provider/auth";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/provider/auth/check-email";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

const CheckEmail = ({ onEmailSubmit }: CheckEmailProps) => {
  const { checkEmailExists, isLoading, form } =
    useProviderCheckEmail({ onEmailSubmit });
  const { register, handleSubmit, errors } = form;

  const onSubmit = (values: ProviderEmailFormData) => {
    checkEmailExists(values.email);
  };
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between min-h-screen py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative z-10 flex items-center px-8 justify-between w-full">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <Logo variant={mounted && theme === "light" ? "black" : "white"} />
        </div>
        <Link
          href={ROUTES.patient.checkEmail}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-4 py-2 rounded-full"
        >
          {CHECK_EMAIL_TEXTS.header.switchToPatients}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 md:px-12 w-full max-w-md mx-auto">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {CHECK_EMAIL_TEXTS.form.titlePart1}{" "}
              <span className="text-primary">
                {CHECK_EMAIL_TEXTS.form.signIn}
              </span>{" "}
              {CHECK_EMAIL_TEXTS.form.or}{" "}
              <span className="text-primary">
                {CHECK_EMAIL_TEXTS.form.signUp}
              </span>
              <br />
              <span className="text-2xl md:text-3xl text-muted-foreground font-bold">
                {CHECK_EMAIL_TEXTS.form.titlePart2}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {CHECK_EMAIL_TEXTS.welcome.description}
            </p>
          </div>

          <form
            id="email-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-base font-medium pl-1">
                {CHECK_EMAIL_TEXTS.form.emailLabel}
              </Label>
              <div className="relative">
                <Input
                  {...register("email")}
                  placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
                  className={`h-14 pl-4 pr-16 text-lg transition-all duration-200 ${
                    errors?.email
                      && "border-destructive focus-visible:ring-destructive/30"
                  }`}
                  disabled={isLoading}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  maxLength={255}
                  minLength={3}
                  required
                  autoSave="on"
                  autoFocus
                />
                <LoadingButton
                  type="submit"
                  size="icon"
                  loading={isLoading}
                  disabled={!!errors?.email}
                  className={`absolute right-2 top-2 h-10 w-10 rounded-lg transition-all duration-300 ${
                    !errors?.email && !isLoading
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </LoadingButton>
              </div>
              {errors?.email && (
                <p className="text-sm text-destructive font-medium pl-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

          </form>

          <div className="pt-8 text-center">
            <h2 className="text-xl font-bold text-primary">
              {CHECK_EMAIL_TEXTS.welcome.title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
