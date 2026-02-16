import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckEmailFormProps } from "@/lib/types/components/patient/check-email";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CheckEmailForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isValidEmail,
  onEmailChange,
}: CheckEmailFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
      <div className="flex flex-col">
        <Label className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-500 pl-2 md:pl-4 mb-2">
          {CHECK_EMAIL_TEXTS.form.emailLabel}
        </Label>
        <div className="relative flex">
          <Input
            {...register("email")}
            onChange={(e) => {
              register("email").onChange(e);
              onEmailChange(e);
            }}
            placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
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
              alt={CHECK_EMAIL_TEXTS.form.arrowAlt}
              width={32}
              height={32}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            />
          </Button>
        </div>
      </div>
    </form>
  );
}
