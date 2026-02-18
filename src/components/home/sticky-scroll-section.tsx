import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";
import { STICKY_SCROLL_CONTENT } from "@/lib/constants/components/sticky-scroll";

export function StickyScrollSection() {
  const content = STICKY_SCROLL_CONTENT.map((item) => ({
    title: item.title,
    description: item.description,
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src={item.image}
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover rounded-md"
          alt={item.alt}
        />
      </div>
    ),
  }));

  return (
    <section className="w-full">
      <StickyScroll content={content} />
    </section>
  );
}
