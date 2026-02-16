import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";

export function CheckEmailInfo() {
  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#955aa4] leading-tight">
        {CHECK_EMAIL_TEXTS.info.title}
      </h1>
      <h2 className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-center">
        {CHECK_EMAIL_TEXTS.info.subtitle}
      </h2>
    </div>
  );
}
