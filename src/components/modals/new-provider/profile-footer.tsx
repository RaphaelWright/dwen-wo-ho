"use client";

import { useState } from "react";
import { m } from "motion/react";
import { LogOut, ChevronDown, Trash2, WifiOff, Wifi } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { useAtom } from "jotai";
import { manualOfflineAtom } from "@/atoms/offline";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function ProfileFooter() {
  const { logout } = useAuthQuery();
  const [isOffline, setIsOffline] = useAtom(manualOfflineAtom);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <div className="flex shrink-0 items-center justify-between border-t px-7 py-4">
      <p className="text-muted-foreground text-[11.5px]">
        <span className="text-primary">✏</span> Click any field to edit
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <m.button className="bg-destructive/80! hover:border-destructive! hover:text-destructive! flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[12.5px] font-semibold text-white! transition-all duration-300 ease-in-out hover:bg-transparent!">
            <LogOut size={13} /> Log Out <ChevronDown size={12} />
          </m.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="border">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-[12.5px]"
            onClick={handleLogoutClick}
          >
            <LogOut size={13} /> Log out of account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-[12.5px]"
            onClick={toggleOffline}
          >
            {isOffline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOffline ? "Go online" : "Go offline"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex cursor-pointer items-center gap-2 text-[12.5px]"
            onClick={() => {
              // TODO: Implement delete account
            }}
          >
            <Trash2 className="text-destructive" size={13} /> Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
