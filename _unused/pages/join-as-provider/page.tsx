import JsonLd from "@/components/miscellaneous/json-ld";
import { JSON_LD_FOR_PROVIDERS_PAGE } from "@/configs/json-ld";
import Header from "@/_unused/components/shared/header";
import Services from "@/_unused/components/marketing/landing/services";
import SocialProof from "@/_unused/components/marketing/landing/social-proof";
import { AnimatedTestimonials } from "@/_unused/components/animated-testimonials";
import { BackgroundBeamsWithCollision } from "@/_unused/components/background-beams-with-collision";
import { StickyScrollSection } from "@/_unused/components/marketing/landing/sticky-scroll-section";
import { testimonials } from "@/_unused/lib/marketing/landing";
import Footer from "@/_unused/components/shared/footer/index";
import ProviderPageHero from "@/_unused/components/marketing/join-as-provider/hero";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "For Providers",
  "Join Dwen Wo Ho as a mental health provider and connect with students who need your care.",
  "/join-as-provider",
);

export default function JoinAsProviderPage() {
  return (
    <>
      <JsonLd data={JSON_LD_FOR_PROVIDERS_PAGE} />
      <Header />
      <main className="space-y-20">
        <BackgroundBeamsWithCollision className="min-h-screen">
          <ProviderPageHero />
        </BackgroundBeamsWithCollision>
        <SocialProof />
        <Services />
        <StickyScrollSection />
        <AnimatedTestimonials testimonials={testimonials} />
        <Footer />
      </main>
    </>
  );
}
