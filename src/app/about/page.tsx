import WidthConstraint from "@/components/ui/width-constraint";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-20 bg-background text-foreground">
      <WidthConstraint>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Dwen Wo Ho
            </h1>
            <p className="text-lg leading-relaxed mb-6">
              Dwen Wo Ho, meaning "Think About Yourself" or "Self Care" in Twi,
              is dedicated to empowering individuals to prioritize their
              holistic wellness. We believe that true health encompasses mental,
              physical, and emotional well-being.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our mission is to provide accessible resources, expert guidance,
              and a supportive community to help you navigate your wellness
              journey. Whether you are looking for mindfulness tips, nutritional
              advice, or fitness inspiration, we are here to support you every
              step of the way.
            </p>
            <p className="text-lg leading-relaxed">
              Join us in creating a healthier, happier world, starting with
              yourself.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&auto=format&fit=crop&q=60"
              alt="Wellness and Community"
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </WidthConstraint>
    </div>
  );
}
