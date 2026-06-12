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
      className="bg-card dark:bg-muted/80 mx-auto w-full max-w-xs rounded-lg"
    >
      <Link
        href={`${ROUTES.curator.schools}/${school.id}`}
        className="group border-border/30 relative block overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md"
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
                className="aspect-square object-cover"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <School className="text-muted-foreground/30 h-6 w-6" />
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
                className="bg-background hover:bg-background text-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm"
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
              className="border-warning bg-background/50 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 shadow-xl backdrop-blur-sm"
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
                <School className="text-background/80 h-4 w-4" />
              )}
            </m.div>
          </div>
        </div>

        {/* Footer Section (White Background) */}
        <div className="flex flex-col gap-3 p-3">
          {/* School Name */}
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-foreground line-clamp-1 text-base leading-tight font-semibold">
              {school.name}
            </h1>
            <h1 className="text-foreground line-clamp-1 text-base leading-tight font-semibold">
              {school.nickname}
            </h1>
          </div>

          {/* Bottom Row: Location & Count */}
          <div className="flex items-center justify-between">
            {/* Location */}
            <p className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <MapPin className="text-destructive size-3.5" />
              <span className="line-clamp-1">
                {firstCampus || "Main Campus"}
              </span>
            </p>

            {/* Student Count */}
            {school.isLoading ? (
              <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary rounded-full border-none px-2 py-0.5 text-xs font-semibold"
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
