import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Feeling Overwhelmed?",
    description:
      "Academic pressure, social expectations, and personal challenges can feel like a heavy weight. It's okay to not be okay. Acknowledging that you're struggling is the first step towards feeling better.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/Students/1.png"
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover rounded-md"
          alt="Student feeling overwhelmed"
        />
      </div>
    ),
  },
  {
    title: "A Safe Space to Unload",
    description:
      "Imagine a place where you can share your deepest worries without judgment. Whether anonymously or with a professional, our platform provides the secure environment you need to let go of your burdens.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/Students/6.jpg"
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover rounded-md"
          alt="Student in a safe space"
        />
      </div>
    ),
  },
  {
    title: "Connect with Understanding",
    description:
      "You don't have to face it alone. Connect with peers who understand your journey or licensed professionals who can guide you. Real support is just a click away.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/Students/3.jpg"
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover rounded-md"
          alt="Connecting with others"
        />
      </div>
    ),
  },
  {
    title: "Reclaim Your Peace",
    description:
      "With the right support, you can navigate life's challenges with confidence. Build resilience, find your balance, and get back to living your best life. Your mental health matters.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/Students/10.jpeg"
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover rounded-md"
          alt="Student feeling happy"
        />
      </div>
    ),
  },
];

export function StickyScrollSection() {
  return (
    <section className="w-full">
      <StickyScroll content={content} />
    </section>
  );
}
