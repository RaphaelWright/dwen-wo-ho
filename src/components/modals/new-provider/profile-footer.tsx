"use client";

import { motion } from "framer-motion";
import { LogOut, ChevronDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NEW_PROVIDER_LOGOUT_ITEMS } from "@/data/mock-provider-data";

export function ProfileFooter() {
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
          {NEW_PROVIDER_LOGOUT_ITEMS.map((o) => (
            <DropdownMenuItem
              key={o.label}
              className="flex items-center gap-2 text-[12.5px] cursor-pointer"
            >
              {<o.icon size={13} />} {o.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-[12.5px] cursor-pointer text-destructive">
            <Trash2 className="text-destructive" size={13} /> Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
