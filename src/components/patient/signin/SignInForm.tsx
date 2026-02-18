import Link from "next/link";
import { SignInFormProps } from "@/lib/types/components/patient/signin";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm({
  email,
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
  errorMessage,
  forgotPasswordHref,
}: SignInFormProps) {
  return (
    <form
      id="login-form"
      onSubmit={onSubmit}
      className="px-12 md:px-24 w-full max-w-4xl mx-auto"
    >
      <h1 className="text-5xl font-extrabold text-center mb-16">
        {SIGN_IN_TEXTS.form.title}
      </h1>

      <div className="my-16 space-y-6">
        <div className="flex flex-col">
          <Label className="text-2xl font-bold text-gray-500 pl-4 mb-2">
            {SIGN_IN_TEXTS.form.emailLabel}
          </Label>
          <Input
            {...register("email")}
            value={email}
            disabled
            className={`font-bold w-full rounded-xl border-4 text-xl md:text-2xl text-muted-foreground p-4 bg-muted border-transparent`}
          />
        </div>

        <div className="flex flex-col">
          <Label className="text-lg md:text-2xl font-bold text-gray-500 pl-4 mb-2">
            {SIGN_IN_TEXTS.form.passwordLabel}
          </Label>
          <div className="relative">
            <Input
              {...register("password")}
              placeholder={SIGN_IN_TEXTS.form.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
              className={`font-bold w-full rounded-xl border-4 ${
                errors?.password
                  ? "border-destructive text-destructive"
                  : "border-success text-muted-foreground"
              } text-xl md:text-2xl p-4 bg-muted outline-none`}
              autoFocus
            />
            <Button
              type="button"
              onClick={onTogglePassword}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 font-semibold"
            >
              {showPassword ? SIGN_IN_TEXTS.form.hide : SIGN_IN_TEXTS.form.show}
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-center font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="text-center mt-6">
        <h1 className="text-xl md:text-2xl font-bold text-center text-primary">
          {SIGN_IN_TEXTS.form.recoverPrompt}{" "}
          {forgotPasswordHref && (
            <Link href={forgotPasswordHref} className="text-destructive">
              {SIGN_IN_TEXTS.form.recoverLink}
            </Link>
          )}
        </h1>
      </div>
    </form>
  );
}
