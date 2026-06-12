import Image from "next/image";
import { Pencil } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { SchoolHeaderCardProps } from "@/lib/types/components/curator/school-details";
import { activateOnKeyboard } from "@/lib/utils/a11y";

export function SchoolHeaderCard({
  school,
  campusLabel,
  onEditClick,
  searchComponent,
}: SchoolHeaderCardProps) {
  return (
    <div className="bg-card border-border group relative mb-8 rounded-3xl border p-6 shadow-sm sm:p-4">
      <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-row items-center gap-6">
          {/* Logo */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Edit school logo"
            onClick={onEditClick}
            onKeyDown={activateOnKeyboard(onEditClick)}
            className="relative shrink-0 cursor-pointer"
          >
            <div className="border-card bg-muted relative size-20 overflow-hidden rounded-2xl border-4 shadow-lg transition-all duration-300 group-hover:shadow-xl sm:size-25">
              {school.logo ? (
                <Image
                  src={school.logo}
                  alt={school.name}
                  width={80}
                  height={80}
                  priority
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="bg-muted text-muted-foreground/50 flex h-full w-full items-center justify-center">
                  <MdSchool className="text-4xl sm:text-5xl" />
                </div>
              )}

              {/* Edit Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 hover:opacity-100">
                <Pencil className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div
              role="button"
              tabIndex={0}
              aria-label="Edit school details"
              onClick={onEditClick}
              onKeyDown={activateOnKeyboard(onEditClick)}
              className="group/title cursor-pointer"
            >
              <h1 className="text-foreground group-hover/title:text-primary truncate text-xl leading-tight font-bold transition-colors min-[1222px]:text-3xl sm:text-2xl 2xl:text-4xl">
                {school.name}
              </h1>
              {campusLabel && (
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs font-medium sm:mt-2 sm:text-base">
                  <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[10px] tracking-wider uppercase">
                    Campus
                  </span>
                  {campusLabel}
                </div>
              )}
            </div>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:mt-4 sm:gap-x-6 sm:gap-y-2 sm:text-sm">
              {school.nickname && (
                <div className="flex items-center gap-2">
                  <span className="bg-success/50 size-1.5 rounded-full" />
                  <span className="text-foreground font-medium">
                    {school.nickname}
                  </span>
                </div>
              )}
              {school.motto && (
                <div className="text-muted-foreground border-border line-clamp-1 border-l pl-3 italic sm:pl-4">
                  &quot;{school.motto}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Component injection point */}
        {searchComponent && (
          <div className="hidden pb-2 md:ml-auto md:flex md:min-w-0 md:flex-1 md:justify-end md:self-center">
            {searchComponent}
          </div>
        )}
      </div>
    </div>
  );
}
