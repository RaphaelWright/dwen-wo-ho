import Header from "@/components/shared/header";
import Services from "@/components/home/services";
import SocialProof from "@/components/home/social-proof";
import JsonLd from "@/components/miscellaneous/json-ld";
import { JSON_LD_HOME_PAGE } from "@/configs/json-ld";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import HomePageHero from "@/components/hero/home-hero";
import { StickyScrollSection } from "@/components/home/sticky-scroll-section";
import { testimonials } from "@/lib/constants/mock-data";
import Footer from "@/components/shared/footer/index";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata();

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <div>
        <JsonLd data={JSON_LD_HOME_PAGE} />
        <Header />
        <main className="space-y-20 pb-20">
          <BackgroundBeamsWithCollision className="h-auto min-h-screen w-full items-start lg:items-center">
            <HomePageHero />
          </BackgroundBeamsWithCollision>
          <SocialProof />
          <Services />
          <StickyScrollSection />
          <AnimatedTestimonials testimonials={testimonials} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
