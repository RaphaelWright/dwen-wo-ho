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
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8 mb-8 relative group">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Logo */}
        <div onClick={onEditClick} className="cursor-pointer relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-muted group-hover:shadow-xl transition-all duration-300">
            {school.logo ? (
              <Image
                src={school.logo}
                alt={school.name}
                fill
                className="object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/50">
                <MdSchool className="text-5xl" />
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight group-hover/title:text-primary transition-colors">
              {school.name}
            </h1>
            {campusLabel && (
              <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm font-medium">
                <span className="bg-muted px-2 py-0.5 rounded text-xs uppercase tracking-wider text-muted-foreground">
                  Campus
                </span>
                {campusLabel}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
            {school.nickname && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span className="font-medium text-foreground">
                  {school.nickname}
                </span>
              </div>
            )}
            {school.motto && (
              <div className="italic text-muted-foreground border-l border-border pl-4">
                &quot;{school.motto}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Search Component injection point */}
        {searchComponent && (
          <div className="w-full md:w-auto md:ml-auto shrink-0 mt-4 md:mt-0 flex self-end md:self-center pb-2">
            {searchComponent}
          </div>
        )}
      </div>
    </div>
  );
}
