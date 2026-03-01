"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import useNewProvider from "@/hooks/provider/use-new-provider";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const ProviderIdentity = ({
  providerTitle,
  providerName,
  specialty,
  onOpenProfile,
}: {
  providerTitle: string;
  providerName: string;
  specialty: string;
  onOpenProfile: () => void;
}) => (
  <motion.button
    onClick={onOpenProfile}
    className="flex items-center gap-3.5 cursor-pointer px-3 py-2 rounded-[14px] shrink-0 text-left hover:scale-102 transition-all duration-500 ease-in-out"
  >
    {/* Avatar */}
    <div className="relative">
      <div className="size-10 rounded-full flex items-center justify-center text-xl shrink-0 border-2 bg-[linear-gradient(135deg,#2d1f5e,#5b3a9e)] border-primary">
        👨🏽‍⚕️
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] border-2 bg-success">
        ✓
      </div>
    </div>

    {/* Name + spec */}
    <div>
      <div className="flex items-center gap-1.5 text-[14.5px] font-bold">
        {providerTitle} {providerName}
        <span className="px-0.5 py-0.5 text-muted-foreground">
          <ChevronDown />
        </span>
      </div>
      <div className="text-[11.5px] font-medium text-muted-foreground">
        {specialty}
      </div>
    </div>
  </motion.button>
);

const SearchBar = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
}) => (
  <InputGroup className="w-full rounded-2xl">
    <PlaceholdersAndVanishInput
      onChange={(e) => onSearchChange(e.target.value)}
      value={searchQuery}
      placeholders={["Search patients...", "Search schools…"]}
      onSubmit={(e) => {
        e.preventDefault();
        onSearchChange("");
      }}
      className="h-11/12 border-0 shadow-none bg-transparent!"
    />
    <InputGroupAddon>
      <Search />
    </InputGroupAddon>
  </InputGroup>
);

const NotificationBell = ({
  unreadCount,
  onOpenNotifs,
}: {
  unreadCount: number;
  onOpenNotifs: () => void;
}) => (
  <div className="flex items-center gap-2.5">
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onOpenNotifs}
      className="relative size-9 flex items-center justify-center rounded-lg border cursor-pointer bg-card/90 hover:bg-muted/80"
      aria-label="Open notifications"
    >
      <Bell className="size-5" />
      {unreadCount > 0 && (
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(16,185,129,.5)",
              "0 0 0 5px rgba(16,185,129,0)",
              "0 0 0 0 rgba(16,185,129,.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1.5 right-1.5 size-2 rounded-full border-2 bg-success"
        />
      )}
    </motion.button>
  </div>
);

export default function Navbar() {
  const {
    profileData: { name, specialty, title },
    searchQuery,
    unreadCount,
    setSearchQuery,
    setProfileOpen,
    setNotifOpen,
  } = useNewProvider();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="grid grid-cols-3 items-center px-2 border-b">
      <div className="flex gap-2 items-center">
        <Logo variant={mounted && theme === "light" ? "black" : "white"} />
        {/* Divider */}
        <div className="w-0.5 h-6 mx-5 shrink-0 bg-foreground/20" />
      </div>

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex items-center gap-4 ml-auto justify-between">
        <ProviderIdentity
          providerTitle={title}
          providerName={name}
          specialty={specialty}
          onOpenProfile={() => setProfileOpen(true)}
        />
        <ThemeToggle />
        <NotificationBell
          unreadCount={unreadCount}
          onOpenNotifs={() => setNotifOpen(true)}
        />
      </div>
    </header>
  );
}
