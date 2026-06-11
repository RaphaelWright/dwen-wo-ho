"use client";

import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { m } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Clock,
  LogOut,
  Phone,
  Mail,
  Check,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PENDING_APPROVAL_TEXTS } from "@/lib/constants/components/provider/pending-approval";
import { Logo } from "../shared/Logo";
import type { PendingApprovalModalProps } from "@/lib/types/provider/pending-approval";
import { useTheme } from "next-themes";

export function PendingApprovalModal({
  userInfo,
  onLogout,
}: PendingApprovalModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const role = userInfo.title || userInfo.specialty;
  const initials = userInfo.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const { theme } = useTheme();
  const mounted = useHydrated();
  return (
    <div className="min-h-screen backdrop-blur-xs flex items-center justify-center p-4 fixed inset-0 z-50 ">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "bg-background border border-border shadow-2xl rounded-2xl w-full max-w-3xl lg:max-w-4xl",
          "max-h-[90vh] overflow-y-auto scrollbar-hide",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-4 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Logo
              withLink={false}
              variant={mounted && theme === "light" ? "black" : "white"}
              className="w-30 h-auto sm:w-auto"
            />
          </div>
          <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-md">
            {PENDING_APPROVAL_TEXTS.headerLabel}
          </span>
        </div>

        {/* Hero: profile + status */}
        <div className="flex flex-col sm:flex-row items-center gap-6 px-3 sm:px-6 py-6 border-b border-border/20">
          <div className="flex items-center gap-5 flex-1 min-w-0 text-center sm:text-left">
            <div className="relative shrink-0">
              <Avatar className="size-20 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={userInfo.profileImage}
                  alt={userInfo.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-6 bg-yellow-500 rounded-full border-2 border-background flex items-center justify-center">
                <Clock className="size-3.5 text-white" aria-hidden />
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <h2 className="text-xl font-bold text-foreground truncate">
                {userInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {role}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submitted {userInfo.timeAgo}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0 mt-2 sm:mt-0">
            <div className="relative size-[72px]" aria-hidden>
              <svg
                className="absolute inset-0 size-full -rotate-90"
                viewBox="0 0 72 72"
              >
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-yellow-500/15"
                />
                <m.circle
                  cx="36"
                  cy="36"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="40 161"
                  className="text-yellow-500"
                  style={{ transformOrigin: "50% 50%" }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="size-7 text-yellow-500" />
              </div>
            </div>
            <span className="text-base font-semibold text-foreground whitespace-nowrap">
              {PENDING_APPROVAL_TEXTS.status}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-pretty leading-relaxed text-center pt-2">
          Our team is finishing the background check. Most applications clear
          this stage within a few business days.
        </p>

        {/* Timeline */}
        <div className="px-3 sm:px-6 py-6 border-b border-border/20">
          <div className="relative flex">
            <div className="absolute top-5 left-[16.5%] right-[16.5%] h-px bg-border" />

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="size-10 rounded-full bg-green-800 flex items-center justify-center mb-2">
                <Check className="size-4.5 text-white" aria-hidden />
              </div>
              <p className="text-sm font-semibold">Application submitted</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userInfo.timeAgo}
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="size-10 rounded-full bg-yellow-700 flex items-center justify-center mb-2">
                <Clock className="size-4.5 text-white" aria-hidden />
              </div>
              <p className="text-sm font-semibold">Under review</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                In progress
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <Circle
                  className="size-4.5 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <p className="text-sm font-semibold">Decision</p>
              <p className="text-xs text-muted-foreground mt-0.5">Awaiting</p>
            </div>
          </div>
        </div>

        {/* While you wait + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 sm:px-6 py-6">
          <div className="bg-muted/40 rounded-xl p-5">
            <p className="text-sm font-semibold mb-3">While you wait</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Mail className="size-4 mt-0.5 shrink-0" aria-hidden />
                {`We'll email you as soon as a decision is made`}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="size-4 mt-0.5 shrink-0" aria-hidden />
                {`Reach out anytime if you'd like an update`}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <LogOut className="size-4 mt-0.5 shrink-0" aria-hidden />
                You can safely log out and check back later
              </li>
            </ul>
          </div>

          <div className="bg-muted/40 rounded-xl p-5">
            <p className="text-sm font-semibold mb-3">
              Contact verification team
            </p>
            <p className="text-sm text-muted-foreground mb-3 text-pretty">
              {PENDING_APPROVAL_TEXTS.contactMessage}
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${PENDING_APPROVAL_TEXTS.phone}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors w-fit"
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                {PENDING_APPROVAL_TEXTS.phone}
              </a>
              <a
                href={`mailto:${PENDING_APPROVAL_TEXTS.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors w-fit break-all"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {PENDING_APPROVAL_TEXTS.email}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-6 py-4 flex justify-center items-center border-t border-border/20">
          <LoadingButton
            onClick={() => {
              setIsLoggingOut(true);
              onLogout();
            }}
            loading={isLoggingOut}
            loadingText={PENDING_APPROVAL_TEXTS.loggingOut}
            variant="destructive"
            className="w-auto min-w-30 gap-2 rounded-sm motion-safe:hover:scale-105 transition-all duration-300"
          >
            <LogOut className="size-4" aria-hidden />
            {PENDING_APPROVAL_TEXTS.logout}
          </LoadingButton>
        </div>
      </m.div>
    </div>
  );
}
