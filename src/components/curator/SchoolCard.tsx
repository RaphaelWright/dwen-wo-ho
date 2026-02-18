import Image from "next/image";
import Link from "next/link";
import { School, Loader2, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { getFirstCampus } from "@/hooks/curator/useCuratorSchools";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export function SchoolCard({ school }: { school: SchoolWithExtras }) {
  const firstCampus = getFirstCampus(school.campuses);
  const displayNickname = school.nickname || school.name;

  // Format student count for display (e.g., 1.2k)
  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  return (
    <div className="w-full max-w-sm group/card mx-auto">
      <Link
        href={`${ROUTES.curator.schools}/${school.id}`}
        className={cn(
          "cursor-pointer overflow-hidden relative card h-88 rounded-xl shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-2xl",
          "bg-cover bg-center bg-no-repeat",
        )}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {school.logo ? (
            <Image
              src={school.logo}
              alt={school.name}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <School className="w-20 h-20 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/60 transition-colors duration-300 z-10" />

        {/* Top Content */}
        <div className="flex flex-row items-center space-x-4 z-20">
          <div className="h-10 w-10 rounded-full border-2 border-white/20 bg-background/10 backdrop-blur-md overflow-hidden relative flex items-center justify-center">
            {school.logo ? (
              <Image
                src={school.logo}
                alt="Logo"
                fill
                className="object-cover"
              />
            ) : (
              <School className="w-5 h-5 text-white/80" />
            )}
          </div>

          <div className="flex flex-col">
            <p className="font-semibold text-base text-gray-50 drop-shadow-sm">
              {displayNickname}
            </p>
            <p className="text-xs text-gray-300 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {firstCampus || "Main Campus"}
            </p>
          </div>
        </div>

        {/* Badges / Status */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
          {school.newPatientName && !school.isLoading && (
            <Badge
              variant="secondary"
              className="bg-white/90 text-black backdrop-blur-md shadow-sm text-xs py-0.5 px-2"
            >
              New Patient
            </Badge>
          )}
        </div>

        {/* Bottom Content */}
        <div className="z-20 space-y-3">
          {/* Student Count / Loading */}
          <div className="flex items-center gap-2">
            {school.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
            ) : (
              <Badge
                variant="outline"
                className="text-white border-white/30 bg-black/20 backdrop-blur-sm"
              >
                {formatCount(school.studentCount ?? 0)} Students
              </Badge>
            )}
          </div>

          <div>
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 leading-tight drop-shadow-md line-clamp-2">
              {school.name}
            </h1>
            {school.motto && (
              <p className="font-medium text-xs text-gray-300 mt-2 line-clamp-1 italic">
                "{school.motto}"
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
