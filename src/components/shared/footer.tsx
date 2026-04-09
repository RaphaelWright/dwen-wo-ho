"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import { LinkPreview } from "@/components/ui/link-preview";
import Image from "next/image";
import WidthConstraint from "../ui/width-constraint";
import {
  COMMUNITY_GALLERY_IMAGES,
  FOOTER_BOTTOM_LINKS,
  FOOTER_DOCK_ITEMS,
  NEWSLETTER_PLACEHOLDERS,
  WELLNESS_TIPS,
} from "@/lib/constants/components/footer";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-foreground py-10 ">
      <WidthConstraint>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* About Us Section with Social Icons */}
          <div className="md:col-span-5 pr-0 md:pr-8">
            <h3 className="text-white text-xl font-medium mb-8 tracking-wide">
              About Dwen Wo Ho
            </h3>
            <p className="mb-8 leading-relaxed text-[15px]">
              Dwen Wo Ho is your dedicated partner in holistic wellness. We
              empower you to take charge of your mental and physical health
              through personalized care, community support, and expert
              resources. Prioritize yourself today.
            </p>

            {/* Social Media Icons Group */}
            <div>
              <FloatingDock
                items={FOOTER_DOCK_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return {
                    ...item,
                    icon: <Icon />,
                  };
                })}
              />
            </div>

            {/* shadcn Subscribe Form */}
            <PlaceholdersAndVanishInput
              placeholders={NEWSLETTER_PLACEHOLDERS}
              onChange={(e) => {}}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="bg-muted/10 border-none text-white rounded-full h-13.75 pl-4 pr-1 w-full max-w-full overflow-hidden"
              submitButton={({ value }) => (
                <Button
                  type="submit"
                  className="absolute top-1 right-1 w-10 lg:w-auto h-10 lg:h-11.75 mr-2 mt-0.5 lg:mt-0 lg:mr-0 px-4 sm:px-8 rounded-full bg-primary hover:bg-primary/80 text-white font-semibold transition-colors gap-2 z-50 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  {value && <ArrowRight className="size-4" />}
                  {!value && <ArrowRight className="size-4 sm:hidden" />}
                </Button>
              )}
            />
          </div>

          {/* Latest Tweet Section (Remains the same) */}
          <div className="md:col-span-4">
            <h3 className="text-white text-xl font-medium mb-8 tracking-wide">
              Wellness Tips
            </h3>
            <ul className="space-y-6">
              {WELLNESS_TIPS.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-4 mt-1 shrink-0">
                    <ArrowRight className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="font-serif italic text-[15px] leading-relaxed">
                    <LinkPreview
                      url={tip.url}
                      className="font-bold text-white hover:text-primary transition-colors"
                    >
                      {tip.title}
                    </LinkPreview>{" "}
                    {tip.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram Section (Remains the same) */}
          <div className="md:col-span-3">
            <h3 className="text-white text-xl font-medium mb-8 tracking-wide">
              Community Gallery
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMUNITY_GALLERY_IMAGES.map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="block relative aspect-square hover:opacity-50 transition-opacity overflow-hidden rounded-lg"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={i === 0}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Menu & Logo (Remains the same) */}
        <div className="mt-28 pt-8 border-t border-white/10 flex flex-col items-center text-center space-y-4 md:space-y-0 md:flex-row md:text-left">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6 md:mr-auto text-white">
            {FOOTER_BOTTOM_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href as any}
                  className="hover:text-primary transition-colors text-sm sm:text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-auto">
            <a
              href="#"
              className="text-white font-medium hover:text-primary transition-colors text-sm sm:text-base"
            >
              Just Go Health
            </a>
            <span className="opacity-50 text-sm">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </WidthConstraint>
    </footer>
  );
}
