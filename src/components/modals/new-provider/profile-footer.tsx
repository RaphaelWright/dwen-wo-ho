"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <div className="px-7 py-4 border-t flex items-center justify-between shrink-0">
      <p className="text-[11.5px] text-muted-foreground">
        <span className="text-primary">✏</span> Click any field to edit
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[12.5px] font-semibold cursor-pointer bg-destructive/80! text-white! hover:bg-transparent! hover:border-destructive! hover:text-destructive! transition-all duration-300 ease-in-out">
            <LogOut size={13} /> Log Out <ChevronDown size={12} />
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="border">
          <DropdownMenuItem
            className="flex items-center gap-2 text-[12.5px] cursor-pointer"
            onClick={handleLogoutClick}
          >
            <LogOut size={13} /> Log out of account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-[12.5px] cursor-pointer"
            onClick={toggleOffline}
          >
            {isOffline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOffline ? "Go online" : "Go offline"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-[12.5px] cursor-pointer text-destructive"
            onClick={() => {
              // TODO: Implement delete account
              console.log("Delete account clicked");
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
