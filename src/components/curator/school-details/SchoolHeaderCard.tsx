import Image from "next/image";
import { Pencil } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { SchoolHeaderCardProps } from "@/lib/types/components/curator/school-details";

export function SchoolHeaderCard({
  school,
  campusLabel,
  onEditClick,
  searchComponent,
}: SchoolHeaderCardProps) {
  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-4 mb-8 relative group">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex flex-row items-center gap-6 min-w-0">
          {/* Logo */}
          <div
            onClick={onEditClick}
            className="cursor-pointer relative shrink-0"
          >
            <div className="relative size-20 sm:size-25 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-muted group-hover:shadow-xl transition-all duration-300">
              {school.logo ? (
                <Image
                  src={school.logo}
                  alt={school.name}
                  width={80}
                  height={80}
                  priority
                  className="object-cover rounded-2xl w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/50">
                  <MdSchool className="text-4xl sm:text-5xl" />
                </div>
              )}

              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Pencil className="text-white w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div onClick={onEditClick} className="cursor-pointer group/title">
              <h1 className="text-xl sm:text-2xl min-[1222px]:text-3xl 2xl:text-4xl font-bold text-foreground leading-tight group-hover/title:text-primary transition-colors truncate">
                {school.name}
              </h1>
              {campusLabel && (
                <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-base font-medium">
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-muted-foreground">
                    Campus
                  </span>
                  {campusLabel}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              {school.nickname && (
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-success/50" />
                  <span className="font-medium text-foreground">
                    {school.nickname}
                  </span>
                </div>
              )}
              {school.motto && (
                <div className="italic text-muted-foreground border-l border-border pl-3 sm:pl-4 line-clamp-1">
                  &quot;{school.motto}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Component injection point */}
        {searchComponent && (
          <div className="hidden md:flex md:flex-1 md:min-w-0 md:ml-auto md:justify-end md:self-center pb-2">
            {searchComponent}
          </div>
        )}
      </div>
    </div>
  );
}
