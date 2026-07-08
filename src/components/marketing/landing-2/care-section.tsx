import { LANDING_2_CARE_STEPS } from "@/lib/marketing/landing-2";

export function Landing2CareSection() {
  return (
    <section className="bg-muted/55">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-20">
        <div className="l2-rise">
          <p className="text-primary text-sm font-extrabold">How it works</p>
          <h2 className="mt-3 text-4xl leading-tight font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Start quietly. Get routed well. Come back anytime.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl leading-7">
            Made for students who need privacy before they are ready to speak
            out loud.
          </p>
        </div>

        <div className="space-y-3">
          {LANDING_2_CARE_STEPS.map((step, index) => (
            <article
              className="l2-rise border-border bg-background grid gap-4 rounded-2xl border p-5 sm:grid-cols-[3rem_1fr]"
              key={step.title}
            >
              <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-sm font-extrabold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 leading-7">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
