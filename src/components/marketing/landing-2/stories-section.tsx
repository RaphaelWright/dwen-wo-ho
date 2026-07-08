import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { LANDING_2_CHARACTERS } from "@/lib/marketing/landing-2";
import { buildPatientJoinRoute } from "@/lib/utils/marketing/landing-2-referral";

export function Landing2StoriesSection() {
  return (
    <section className="border-border/70 border-y">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8 lg:py-20">
        <div className="l2-rise">
          <p className="text-primary text-sm font-extrabold">
            Pick your energy
          </p>
          <h2 className="mt-3 max-w-xl text-4xl leading-tight font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Lock in with people who made pressure look possible.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl leading-7 text-pretty">
            Choose a personality, start your check-in, and build your own care
            rhythm.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {LANDING_2_CHARACTERS.map((character) => (
            <article
              className="l2-rise border-border bg-card group overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1"
              key={character.name}
            >
              <div className="bg-muted/60 relative aspect-[5/4] overflow-hidden">
                <Image
                  className="relative z-10 h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
                  src={character.photo}
                  alt={`${character.name}, student achiever`}
                  width={700}
                  height={560}
                  sizes="(max-width: 768px) 90vw, 36vw"
                  unoptimized
                />
              </div>
              <div className="p-5">
                <div>
                  <h3 className="text-2xl font-extrabold">{character.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm font-semibold">
                    {character.headline}
                  </p>
                </div>

                <ul className="mt-5 space-y-2">
                  {character.achievements.slice(0, 4).map((achievement) => (
                    <li
                      className="flex gap-2 text-sm font-semibold"
                      key={achievement.text}
                    >
                      <Sparkles
                        className="text-primary mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{achievement.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition-colors"
                  href={buildPatientJoinRoute(character.name)}
                >
                  Lock in with @{character.name}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
