import { ShieldCheck } from "lucide-react";
import { LANDING_2_SUPPORT_POINTS } from "@/lib/marketing/landing-2";

export function Landing2SupportSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="l2-rise max-w-2xl">
          <p className="text-primary text-sm font-extrabold">Why it matters</p>
          <h2 className="mt-3 text-4xl leading-tight font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            A private bridge between feeling fine and getting real support.
          </h2>
        </div>
        <p className="text-muted-foreground l2-rise max-w-2xl leading-7 text-pretty lg:justify-self-end">
          Start small. Say what is heavy. Get routed to care that fits.
        </p>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {LANDING_2_SUPPORT_POINTS.map((point) => (
          <article
            className="l2-rise border-border bg-card rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1"
            key={point.title}
          >
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-extrabold">{point.title}</h3>
            <p className="text-muted-foreground mt-3 leading-7">{point.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
