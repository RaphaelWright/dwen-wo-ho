"use client";

import { motion } from "framer-motion";
import { School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NEW_PROVIDER_SCHOOLS } from "@/data/mock-provider-data";
import useNewProvider from "@/hooks/provider/use-new-provider";
import { cn } from "@/lib/utils";

/**
 * Left sidebar — school filter list.
 *
 * @param {{
 *   activeSchool: string,
 *   onSelectSchool: (id: string) => void,
 * }} props
 */
export default function SchoolsSidebar() {
  const { activeSchool, handleSelectSchool } = useNewProvider();
  return (
    <aside className="w-full shrink-0 flex flex-col overflow-y-auto no-scrollbar border-r h-full pb-40 md:pb-10">
      {/* Header label */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          My Schools
        </p>
      </div>

      {/* School list */}
      <ScrollArea className="flex-1 px-2.5 pb-4">
        <div className="flex flex-col gap-1">
          {NEW_PROVIDER_SCHOOLS.map((school, i) => {
            const isActive = activeSchool === school.id;
            const isAll = school.id === "all";

            return (
              <motion.button
                key={school.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.12) }}
                onClick={() => handleSelectSchool(school.id)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer w-full text-left transition-all duration-300 ease-in-out",
                  isActive
                    ? "bg-primary/15 hover:bg-primary/15"
                    : "bg-transparent hover:bg-card",
                )}
              >
                {/* Logo square */}
                <Avatar
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 border text-[12px] font-black",
                    !isAll ? "bg-primary/20 border-primary/30" : "bg-white",
                  )}
                >
                  <AvatarImage src={school.avatarUrl} />
                  <AvatarFallback
                    className={cn(
                      "bg-transparent",
                      !isAll ? "text-primary" : "",
                    )}
                  >
                    {isAll ? (
                      <School className="size-4 text-primary" />
                    ) : (
                      school.label.slice(0, 2).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Name + count */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-[12.5px] font-semibold truncate",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {school.label}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground/60">
                    {school.count} patients
                  </p>
                </div>

                {/* Notification dot */}
                {school.hasNotif && (
                  <div className="size-1.75 rounded-full shrink-0 bg-success" />
                )}
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
