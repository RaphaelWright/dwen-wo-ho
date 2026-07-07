import { Landing2CareSection } from "./care-section";
import { Landing2CtaSection } from "./cta-section";
import { Landing2Hero } from "./hero";
import { Landing2Nav } from "./nav";
import { Landing2StoriesSection } from "./stories-section";
import { Landing2SupportSection } from "./support-section";

export function Landing2() {
  return (
    <main className="bg-background text-foreground min-h-[100dvh] overflow-hidden antialiased">
      <Landing2Nav />
      <Landing2Hero />
      <Landing2StoriesSection />
      <Landing2SupportSection />
      <Landing2CareSection />
      <Landing2CtaSection />
    </main>
  );
}
