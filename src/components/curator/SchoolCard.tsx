import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { School, Loader2, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { getFirstCampus } from "@/hooks/curator/use-curator-schools";
import { Badge } from "../ui/badge";

// Format student count for display (e.g., 1.2k)
const formatCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count;
};

export function SchoolCard({
  school,
  priority = false,
}: {
  school: SchoolWithExtras;
  priority?: boolean;
}) {
  const firstCampus = getFirstCampus(school.campuses);

  return (
    <m.div
      initial="initial"
      whileHover="hover"
      className="w-full max-w-xs mx-auto bg-card dark:bg-muted/80 rounded-lg"
    >
      <Link
        href={`${ROUTES.curator.schools}/${school.id}`}
        className="block group overflow-hidden relative rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border/30"
      >
        {/* Header Section (Image Background) */}
        <div className="relative h-48 w-full overflow-hidden">
          {/* Background Image Layer */}
          <m.div
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
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover aspect-square"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <School className="w-6 h-6 text-muted-foreground/30" />
              </div>
            )}
          </m.div>

          {/* Dark Overlay */}
          <m.div
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
                className="bg-background hover:bg-background text-foreground shadow-sm font-semibold text-xs py-0.5 px-2.5 rounded-full"
              >
                New Patient
              </Badge>
            )}
          </div>

          {/* Centered Circular Logo */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <m.div
              variants={{
                initial: { scale: 1, y: 0 },
                hover: { scale: 1.1, y: -3 },
              }}
              className="h-16 w-16 rounded-full border-4 border-warning bg-background/50 backdrop-blur-sm overflow-hidden relative flex items-center justify-center shadow-xl"
            >
              {school.logo ? (
                <Image
                  src={school.logo}
                  alt="Logo"
                  width={28}
                  height={28}
                  priority={priority}
                  className="object-contain"
                />
              ) : (
                <School className="w-4 h-4 text-background/80" />
              )}
            </m.div>
          </div>
        </div>

        {/* Footer Section (White Background) */}
        <div className="p-3 flex flex-col gap-3">
          {/* School Name */}
          <div className="flex justify-between items-center gap-2">
            <h1 className="font-semibold text-base text-foreground leading-tight line-clamp-1">
              {school.name}
            </h1>
            <h1 className="font-semibold text-base text-foreground leading-tight line-clamp-1">
              {school.nickname}
            </h1>
          </div>

          {/* Bottom Row: Location & Count */}
          <div className="flex items-center justify-between">
            {/* Location */}
            <p className="text-sm text-muted-foreground flex items-center gap-1 font-medium">
              <MapPin className="size-3.5 text-destructive" />
              <span className="line-clamp-1">
                {firstCampus || "Main Campus"}
              </span>
            </p>

            {/* Student Count */}
            {school.isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none font-semibold rounded-full px-2 py-0.5 text-xs"
              >
                {formatCount(school.totalPatients ?? school.studentCount ?? 0)}{" "}
                Patients
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}
