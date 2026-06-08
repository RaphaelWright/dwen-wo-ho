"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingButton } from "@/components/ui/loading-button";
import { Clock, LogOut, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { PENDING_APPROVAL_TEXTS } from "@/lib/constants/components/provider/pending-approval";
import { Logo } from "../shared/Logo";
import type { PendingApprovalModalProps } from "@/lib/types/provider/pending-approval";

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

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "bg-card border border-border shadow-2xl rounded-2xl w-full max-w-3xl lg:max-w-4xl",
          "flex flex-col overflow-hidden",
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Logo withLink={false} variant="auto" className="w-30" />
          <span className="text-sm text-muted-foreground">
            {PENDING_APPROVAL_TEXTS.headerLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] md:divide-x divide-border/50">
          <div className="flex flex-row items-center gap-4 px-6 py-5 text-left">
            <div className="relative shrink-0">
              <Avatar className="size-16 md:size-20 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={userInfo.profileImage}
                  alt={userInfo.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 size-5 bg-yellow-500 rounded-full border-2 border-background flex items-center justify-center">
                <Clock className="size-3 text-white" aria-hidden />
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-bold text-foreground truncate">
                {userInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">{role}</p>
              <span className="text-xs text-muted-foreground capitalize block mt-0.5">
                {userInfo.timeAgo}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 px-6 py-5 shrink-0">
            <div className="relative" aria-hidden>
              <Clock className="size-7 text-yellow-500 motion-safe:animate-pulse" />
              <span className="absolute inset-0 size-7 bg-yellow-500/20 rounded-full motion-safe:animate-ping" />
            </div>
            <span className="text-lg font-semibold text-foreground whitespace-nowrap">
              {PENDING_APPROVAL_TEXTS.status}
            </span>
          </div>

          <div className="px-6 py-5 text-left">
            <p className="text-sm text-muted-foreground mb-4 text-pretty">
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

        <div className="px-6 py-4 flex justify-center items-center mt-5 md:-ml-10">
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
      </motion.div>
    </div>
  );
}
