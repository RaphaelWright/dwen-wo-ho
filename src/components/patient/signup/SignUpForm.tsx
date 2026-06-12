import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { SignUpFormProps } from "@/lib/types/components/patient/signup";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/signup";
import { ROUTES } from "@/lib/constants/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpForm({
  email,
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form id="login-form" onSubmit={onSubmit} className="px-12">
      <h1 className="text-center text-5xl font-extrabold">
        {SIGN_UP_TEXTS.form.title}
      </h1>
      <div className="my-16 space-y-5">
        <Input
          {...register("email")}
          value={email}
          placeholder={email}
          disabled
          className={`text-muted-foreground bg-muted w-full rounded-xl border-4 border-transparent p-4 text-2xl font-bold`}
        />

        <div className="flex flex-col space-y-2">
          <Input
            {...register("fullName")}
            placeholder={SIGN_UP_TEXTS.form.fullNamePlaceholder}
            className={`w-full rounded-xl border-4 font-bold ${
              errors.fullName ? "border-destructive" : "border-transparent"
            } text-muted-foreground bg-muted p-4 text-2xl`}
          />
          {errors.fullName && (
            <span className="ml-4 text-sm text-red-500">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Input
            {...register("phoneNumber")}
            type="tel"
            placeholder={SIGN_UP_TEXTS.form.phoneNumberPlaceholder}
            className={`w-full rounded-xl border-4 font-bold ${
              errors.phoneNumber ? "border-destructive" : "border-transparent"
            } text-muted-foreground bg-muted p-4 text-2xl`}
          />
          {errors.phoneNumber && (
            <span className="ml-4 text-sm text-red-500">
              {errors.phoneNumber.message}
            </span>
          )}
          <h2 className="ml-4 text-lg font-bold text-gray-500 md:text-3xl">
            {SIGN_UP_TEXTS.form.emergencyNote}
          </h2>
        </div>

        <div className="relative mt-4 flex flex-col space-y-2">
          <Input
            {...register("password")}
            placeholder={SIGN_UP_TEXTS.form.passwordPlaceholder}
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-xl border-4 font-bold ${
              errors.password ? "border-destructive" : "border-success"
            } text-muted-foreground bg-muted p-4 text-2xl`}
          />
          <Button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-8.5 right-4 -translate-y-1/2 transform font-semibold text-gray-500"
          >
            {showPassword ? SIGN_UP_TEXTS.form.hide : SIGN_UP_TEXTS.form.show}
          </Button>
          {errors.password && (
            <span className="ml-4 text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold text-gray-500">
        <Checkbox className="mr-4 rounded-none border-black" />
        {SIGN_UP_TEXTS.form.agreeTo}{" "}
        <Link href={ROUTES.public.landing} className="text-destructive">
          {SIGN_UP_TEXTS.form.terms}
        </Link>
      </h1>
    </form>
  );
}
