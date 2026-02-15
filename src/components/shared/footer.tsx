"use client";

import React from "react";
import { ArrowRight, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  IconBrandX,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";
import WidthConstraint from "../ui/width-constraint";
import { LinkPreview } from "@/components/ui/link-preview";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function Footer() {
  return (
    <footer className="bg-[#202126] text-muted-foreground py-10">
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

            {/* Social Media Icons Group (Replaced Phone/Email) */}
            <div>
              <FloatingDock
                items={[
                  {
                    title: "Twitter",
                    icon: <IconBrandX />,
                    href: "#",
                  },
                  {
                    title: "Facebook",
                    icon: <IconBrandFacebook />,
                    href: "#",
                  },
                  {
                    title: "Instagram",
                    icon: <IconBrandInstagram />,
                    href: "#",
                  },
                ]}
              />
            </div>

            {/* shadcn Subscribe Form */}
            <PlaceholdersAndVanishInput
              placeholders={[
                "Enter your e-mail",
                "Join our community",
                "Stay updated",
              ]}
              onChange={(e) => console.log(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                console.log("submitted");
              }}
              className="bg-muted/10 border-none text-white rounded-full h-13.75 pl-4 pr-1"
              submitButton={({ value }) => (
                <Button
                  type="submit"
                  className="absolute top-1 right-1 h-11.75 px-8 rounded-full bg-primary hover:bg-primary/80 text-white font-semibold transition-colors gap-2 z-50"
                >
                  <span>Subscribe</span>
                  {value && <ArrowRight />}
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
              <li className="flex items-start">
                <div className="mr-4 mt-1 shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div className="font-serif italic text-[15px] leading-relaxed">
                  <LinkPreview
                    url="https://www.healthline.com/nutrition/7-health-benefits-of-water"
                    className="font-bold text-white hover:text-primary transition-colors"
                  >
                    Hydration is key!
                  </LinkPreview>{" "}
                  Drink at least 8 glasses of water a day to keep your energy
                  levels high.
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div className="font-serif italic text-[15px] leading-relaxed">
                  <LinkPreview
                    url="https://www.headspace.com/meditation/daily-meditation"
                    className="font-bold text-white hover:text-primary transition-colors"
                  >
                    Take 5 minutes to meditate daily.
                  </LinkPreview>{" "}
                  A calm mind leads to a healthier body.
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div className="font-serif italic text-[15px] leading-relaxed">
                  <LinkPreview
                    url="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/walking/art-20046261"
                    className="font-bold text-white hover:text-primary transition-colors"
                  >
                    Move your body!
                  </LinkPreview>{" "}
                  Even a short walk can improve your mood and circulation.
                </div>
              </li>
            </ul>
          </div>

          {/* Instagram Section (Remains the same) */}
          <div className="md:col-span-3">
            <h3 className="text-white text-xl font-medium mb-8 tracking-wide">
              Community Gallery
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60",
                  alt: "Yoga Session",
                },
                {
                  src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=60",
                  alt: "Community Gathering",
                },
                {
                  src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60",
                  alt: "Healthy Food",
                },
                {
                  src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60",
                  alt: "Mindfulness",
                },
              ].map((item, i) => (
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
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Menu & Logo (Remains the same) */}
        <div className="mt-28 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center">
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mb-4 md:mb-0 mr-auto text-white">
            {(
              [
                { label: "Home", href: ROUTES.public.landing },
                { label: "About", href: ROUTES.public.about },
                { label: "Privacy Policy", href: ROUTES.public.privacyPolicy },
                {
                  label: "Terms & Conditions",
                  href: ROUTES.public.termsAndConditions,
                },
                { label: "Cookie Policy", href: ROUTES.public.cookiePolicy },
              ] as const
            ).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href as any}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center space-x-2">
            <a
              href="#"
              className="text-white font-medium hover:text-primary transition-colors"
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
