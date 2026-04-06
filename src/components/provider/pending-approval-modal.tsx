"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../shared/Logo";
import { useTheme } from "next-themes";

interface PendingApprovalModalProps {
  userInfo: {
    name: string;
    title: string;
    specialty: string;
    profileImage?: string;
    timeAgo: string;
  };
  onLogout: () => void;
}

export function PendingApprovalModal({
  userInfo,
  onLogout,
}: PendingApprovalModalProps) {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md",
          "flex flex-col overflow-hidden",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Logo
              withLink={false}
              variant={theme === "dark" ? "white" : "black"}
              className="w-30"
            />
          </div>
          <span className="text-sm text-muted-foreground">Approval Status</span>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6 flex flex-col items-center text-center">
          {/* Avatar with ring */}
          <div className="relative mb-4">
            <Avatar className="size-24 ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
              <AvatarImage
                src={userInfo.profileImage}
                alt={userInfo.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {userInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator dot */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-background flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Time stamp */}
          <span className="text-xs text-muted-foreground mb-1">Just now</span>

          {/* Name and Title */}
          <h2 className="text-xl font-bold text-foreground mb-1">
            {userInfo.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {userInfo.title || userInfo.specialty}
          </p>
        </div>

        {/* Status Section */}
        <div className="px-6 py-4 bg-muted/10 border-y border-border/10">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />
              <span className="absolute inset-0 w-6 h-6 bg-yellow-500/20 rounded-full animate-ping" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Pending...
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            You can call the JustGo Health verification team or email them to
            speed up the process. Thank you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:0538920991"
              className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
            >
              <Phone className="w-4 h-4" />
              0538920991
            </a>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <a
              href="mailto:prince.baadu7@gmail.com"
              className="flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
            >
              <Mail className="w-4 h-4" />
              prince.baadu7@gmail.com
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border/50 flex justify-center items-center">
          <Button
            onClick={onLogout}
            variant="destructive"
            className=" w-30 gap-2 rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
