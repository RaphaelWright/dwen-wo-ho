import JsonLd from "@/components/miscellaneous/json-ld";
import { JSON_LD_FOR_PROVIDERS_PAGE } from "@/configs/json-ld";
import Header from "@/components/shared/header";
import Services from "@/components/home/services";
import SocialProof from "@/components/home/social-proof";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { StickyScrollSection } from "@/components/home/sticky-scroll-section";
import { testimonials } from "@/lib/constants/mock-data";
import Footer from "@/components/shared/footer";
import ProviderPageHero from "@/components/hero/providers";

export default function ProvidersPage() {
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
