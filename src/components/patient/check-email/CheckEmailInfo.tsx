import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";

export function CheckEmailInfo() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 w-full max-w-2xl space-y-3 delay-500 duration-700">
      {/* Divider with label */}
      <div className="flex items-center gap-4">
        <div className="via-primary/25 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
        <span className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase">
          Join the Community
        </span>
        <div className="via-primary/25 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
      </div>

      <h2 className="text-foreground/90 text-center text-lg leading-tight font-bold tracking-tight sm:text-xl md:text-2xl">
        {CHECK_EMAIL_TEXTS.info.title}
      </h2>
      <p className="text-muted-foreground/60 mx-auto max-w-lg text-center text-sm leading-relaxed sm:text-base">
        {CHECK_EMAIL_TEXTS.info.subtitle}
      </p>
    </div>
  );
}
