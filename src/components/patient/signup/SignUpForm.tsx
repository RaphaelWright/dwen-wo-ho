import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { SignUpFormProps } from "@/lib/types/components/patient/signup";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/signup";
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
      <h1 className="text-5xl text-center font-extrabold">
        {SIGN_UP_TEXTS.form.title}
      </h1>
      <div className="my-16 space-y-5">
        <Input
          {...register("email")}
          value={email}
          placeholder={email}
          disabled
          className={`font-bold w-full rounded-xl border-4 text-2xl text-gray-500 p-4 bg-gray-200/50 border-transparent`}
        />

        <div className="flex flex-col space-y-2">
          <Input
            {...register("fullName")}
            placeholder={SIGN_UP_TEXTS.form.fullNamePlaceholder}
            className={`font-bold w-full rounded-xl border-4 ${
              errors.fullName ? "border-red-500" : "border-transparent"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm ml-4">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Input
            {...register("phoneNumber")}
            type="tel"
            placeholder={SIGN_UP_TEXTS.form.phoneNumberPlaceholder}
            className={`font-bold w-full rounded-xl border-4 ${
              errors.phoneNumber ? "border-red-500" : "border-transparent"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm ml-4">
              {errors.phoneNumber.message}
            </span>
          )}
          <h2 className="ml-4 text-gray-500 text-lg md:text-3xl font-bold">
            {SIGN_UP_TEXTS.form.emergencyNote}
          </h2>
        </div>

        <div className="relative mt-4 flex flex-col space-y-2">
          <Input
            {...register("password")}
            placeholder={SIGN_UP_TEXTS.form.passwordPlaceholder}
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors.password ? "border-red-500" : "border-green-600"
            } text-2xl text-gray-500 p-4 bg-gray-200/50`}
          />
          <Button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-8.5 right-4 transform -translate-y-1/2 text-gray-500 font-semibold"
          >
            {showPassword ? SIGN_UP_TEXTS.form.hide : SIGN_UP_TEXTS.form.show}
          </Button>
          {errors.password && (
            <span className="text-red-500 text-sm ml-4">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-gray-500">
        <Checkbox className="mr-4 rounded-none border-black" />
        {SIGN_UP_TEXTS.form.agreeTo}{" "}
        <Link href="/" className="text-[#ed1c24]">
          {SIGN_UP_TEXTS.form.terms}
        </Link>
      </h1>
    </form>
  );
}
