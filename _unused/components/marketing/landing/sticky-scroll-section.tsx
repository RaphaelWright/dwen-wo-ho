import { StickyScroll } from "@/_unused/components/sticky-scroll-reveal";
import Image from "next/image";
import { STICKY_SCROLL_CONTENT } from "@/_unused/lib/marketing/landing";

export function StickyScrollSection() {
  const content = STICKY_SCROLL_CONTENT.map((item) => ({
    title: item.title,
    description: item.description,
    content: (
      <Image
        src={item.image}
        width={1080}
        height={800}
        quality={100}
        className="h-full w-full rounded-2xl object-cover"
        alt={item.alt}
      />
    ),
  }));

  return (
    <section className="w-full">
      <StickyScroll content={content} />
    </section>
  );
}
