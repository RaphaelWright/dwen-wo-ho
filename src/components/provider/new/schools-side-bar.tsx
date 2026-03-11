"use client";

import { motion } from "framer-motion";
import { School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NEW_PROVIDER_SCHOOLS } from "@/data/mock-provider-data";
import useProviderDashboard from "@/hooks/provider/use-provider-dashboard";
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
  const { activeSchool, handleSelectSchool } = useProviderDashboard();
  return (
    <aside className="w-full shrink-0 flex flex-col overflow-y-auto no-scrollbar border-r h-full pb-40 md:pb-10 lg:border-0 lg:bg-[#fcf1e9] lg:dark:bg-muted lg:h-fit lg:rounded-2xl lg:mt-6 lg:ml-2 lg:pb-2">
      {/* Header label */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          My Schools
        </p>
      </div>

      {/* School list */}
      <ScrollArea className="flex-1 px-2.5 pb-4">
        <div className="flex flex-col gap-2">
          {NEW_PROVIDER_SCHOOLS.map((school, i) => {
            const isActive = activeSchool === school.id;
            const isAll = school.id === "all";

            return (
              <motion.button
                key={school.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSchool(school.id)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer w-full text-left transition-all duration-300 ease-in-out lg:bg-card ",
                  isActive
                    ? "bg-primary/15 hover:bg-primary/15 lg:bg-primary"
                    : "bg-transparent hover:bg-card dark:bg-card/90",
                )}
              >
                {/* Logo square */}
                <Avatar
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 border text-[12px] font-black bg-white",
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
                      isActive ? "text-white" : "text-muted-foreground",
                    )}
                  >
                    {school.label}
                  </p>
                  <p
                    className={cn(
                      "text-[10.5px]",
                      isActive ? "text-white" : "text-muted-foreground/60",
                    )}
                  >
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
