import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";

export function CheckEmailInfo() {
  return (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 space-y-2">
      <div className="grid grid-cols-3 items-center justify-center">
        <hr className="border border-primary/40" />
        <p className="text-center"> Join the Community</p>
        <hr className="border border-primary/40" />
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground/90 leading-tight tracking-tight">
        {CHECK_EMAIL_TEXTS.info.title}
      </h1>
      <p className="mt-3 text-base sm:text-lg md:text-xl font-medium text-center text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
        {CHECK_EMAIL_TEXTS.info.subtitle}
      </p>
    </div>
  );
}
