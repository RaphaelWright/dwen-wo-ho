import WidthConstraint from "@/components/ui/width-constraint";
import Image from "next/image";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "About",
  "Learn about Dwen Wo Ho — accessible, confidential mental healthcare for students across Ghana.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground py-20">
      <WidthConstraint>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              About Dwen Wo Ho
            </h1>
            <p className="mb-6 text-lg leading-relaxed">
              Dwen Wo Ho, meaning &quot;Think About Yourself&quot; or &quot;Self
              Care&quot; in Twi, is dedicated to empowering individuals to
              prioritize their holistic wellness. We believe that true health
              encompasses mental, physical, and emotional well-being.
            </p>
            <p className="mb-6 text-lg leading-relaxed">
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
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&auto=format&fit=crop&q=60"
              alt="Wellness and Community"
              width={400}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </WidthConstraint>
    </div>
  );
}
