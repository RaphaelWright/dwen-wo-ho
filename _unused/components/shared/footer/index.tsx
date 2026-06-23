"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import { LinkPreview } from "@/_unused/components/link-preview";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import {
  COMMUNITY_GALLERY_IMAGES,
  FOOTER_BOTTOM_LINKS,
  FOOTER_DOCK_ITEMS,
  NEWSLETTER_PLACEHOLDERS,
  WELLNESS_TIPS,
} from "@/_unused/lib/marketing/landing";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-foreground py-10">
      <WidthConstraint>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          {/* About Us Section with Social Icons */}
          <div className="pr-0 md:col-span-5 md:pr-8">
            <h3 className="mb-8 text-xl font-medium tracking-wide text-white">
              About Dwen Wo Ho
            </h3>
            <p className="mb-8 text-[15px] leading-relaxed">
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
              onChange={() => {}}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="bg-muted/10 h-13.75 w-full max-w-full overflow-hidden rounded-full border-none pr-1 pl-4 text-white"
              submitButton={({ value }) => (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 absolute top-1 right-1 z-50 mt-0.5 mr-2 h-10 w-10 gap-2 rounded-full px-4 text-sm font-semibold text-white transition-colors sm:px-8 sm:text-base lg:mt-0 lg:mr-0 lg:h-11.75 lg:w-auto"
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
            <h3 className="mb-8 text-xl font-medium tracking-wide text-white">
              Wellness Tips
            </h3>
            <ul className="space-y-6">
              {WELLNESS_TIPS.map((tip) => (
                <li key={tip.title} className="flex items-start">
                  <div className="mt-1 mr-4 shrink-0">
                    <ArrowRight className="h-5 w-5 text-teal-400" />
                  </div>
                  <div className="font-serif text-[15px] leading-relaxed italic">
                    <LinkPreview
                      url={tip.url}
                      className="hover:text-primary font-bold text-white transition-colors"
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
            <h3 className="mb-8 text-xl font-medium tracking-wide text-white">
              Community Gallery
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMUNITY_GALLERY_IMAGES.map((item, i) => (
                <div
                  key={item.alt}
                  className="relative block aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Menu & Logo (Remains the same) */}
        <div className="mt-28 flex flex-col items-center space-y-4 border-t border-white/10 pt-8 text-center md:flex-row md:space-y-0 md:text-left">
          <ul className="flex flex-wrap justify-center gap-4 text-white md:mr-auto md:gap-6">
            {FOOTER_BOTTOM_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-primary text-sm transition-colors sm:text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center space-x-2 md:mt-0 md:ml-auto">
            <span className="text-sm font-medium text-white sm:text-base">
              Just Go Health
            </span>
            <span className="text-sm opacity-50">&copy; {CURRENT_YEAR}</span>
          </div>
        </div>
      </WidthConstraint>
    </footer>
  );
}
