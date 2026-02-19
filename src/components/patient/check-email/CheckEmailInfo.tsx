import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";

export function CheckEmailInfo() {
  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 space-y-3">
      {/* Divider with label */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
          Join the Community
        </span>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-foreground/90 leading-tight tracking-tight">
        {CHECK_EMAIL_TEXTS.info.title}
      </h2>
      <p className="text-sm sm:text-base text-center text-muted-foreground/60 leading-relaxed max-w-lg mx-auto">
        {CHECK_EMAIL_TEXTS.info.subtitle}
      </p>
    </div>
  );
}
