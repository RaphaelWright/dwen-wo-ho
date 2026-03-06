import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { School, Loader2, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { getFirstCampus } from "@/hooks/curator/useCuratorSchools";
import { Badge } from "../ui/badge";

export function SchoolCard({ school }: { school: SchoolWithExtras }) {
  const firstCampus = getFirstCampus(school.campuses);
  const displayNickname = school.name || school.nickname;

  // Format student count for display (e.g., 1.2k)
  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="w-full max-w-sm mx-auto bg-card dark:bg-muted/80 rounded-xl"
    >
      <Link
        href={`${ROUTES.curator.schools}/${school.id}`}
        className="block group overflow-hidden relative rounded-xl shadow-md transition-all duration-300  border border-border/50"
      >
        {/* Header Section (Image Background) */}
        <div className="relative h-74 w-full overflow-hidden">
          {/* Background Image Layer */}
          <motion.div
            variants={{
              initial: { scale: 1 },
              hover: { scale: 0.9 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            {school.logo ? (
              <Image
                src={school.logo}
                alt={school.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <School className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
          </motion.div>

          {/* Dark Overlay */}
          <motion.div
            variants={{
              initial: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
              hover: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          />

          {/* Top Right Badge */}
          <div className="absolute top-3 right-3 z-20">
            {school.newPatientName && !school.isLoading && (
              <Badge
                variant="secondary"
                className="bg-white hover:bg-white text-black shadow-sm font-semibold text-xs py-0.5 px-2.5 rounded-full"
              >
                New Patient
              </Badge>
            )}
          </div>

          {/* Centered Circular Logo */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <motion.div
              variants={{
                initial: { scale: 1, y: 0 },
                hover: { scale: 1.05, y: -5 },
              }}
              className="h-24 w-24 rounded-full border-4 border-yellow-500 bg-background/50 backdrop-blur-sm overflow-hidden relative flex items-center justify-center shadow-2xl"
            >
              {school.logo ? (
                <Image
                  src={school.logo}
                  alt="Logo"
                  fill
                  className="object-center"
                />
              ) : (
                <School className="w-10 h-10 text-white/80" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer Section (White Background) */}
        <div className="p-4 flex flex-col gap-3">
          {/* School Name */}
          <h1 className="font-bold text-lg md:text-xl text-foreground leading-tight line-clamp-1">
            {displayNickname}
          </h1>

          {/* Bottom Row: Location & Count */}
          <div className="flex items-center justify-between">
            {/* Location */}
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="size-4 text-destructive" />
              <span className="line-clamp-1">
                {firstCampus || "Main Campus"}
              </span>
            </p>

            {/* Student Count */}
            {school.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none font-semibold rounded-full px-3 py-0.5"
              >
                {formatCount(school.studentCount ?? 0)} Students
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
