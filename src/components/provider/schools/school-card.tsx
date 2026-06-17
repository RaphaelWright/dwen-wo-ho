import Image from "next/image";
import { MdSchool } from "react-icons/md";
import { SchoolCardProps } from "@/lib/types/components/provider/schools";
import { Button } from "@/components/ui/button";

const getFirstCampus = (campuses: string[] | null | undefined): string => {
  if (campuses && Array.isArray(campuses) && campuses.length > 0) {
    return campuses[0];
  }
  return "";
};

export function SchoolCard({ school, onClick }: SchoolCardProps) {
  const firstCampus = getFirstCampus(school.campuses);
  const displayNickname = school.nickname
    ? firstCampus
      ? `${school.nickname} (${firstCampus})`
      : school.nickname
    : firstCampus
      ? `(${firstCampus})`
      : "";

  return (
    <Button
      onClick={() => onClick(school.id)}
      className="group relative h-80 overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110"
    >
      {/* Background Image */}
      {school.logo ? (
        <div className="absolute inset-0">
          <Image
            src={school.logo}
            alt={school.name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="from-muted to-muted/50 absolute inset-0 flex items-center justify-center bg-linear-to-br">
          <MdSchool className="text-muted-foreground h-20 w-20" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      {/* Loading Indicator */}
      {school.isLoading && (
        <div className="absolute top-4 left-4 z-10">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      )}

      {/* Top Left - New Patient Alert */}
      {school.newPatientName && !school.isLoading && (
        <div className="absolute top-4 left-4 z-10 w-60 border-none bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
          <span className="block truncate text-base font-semibold">
            <span className="text-destructive">New Patient.</span>{" "}
            <span className="text-foreground">{school.newPatientName}</span>
          </span>
        </div>
      )}

      {/* Top Right - Student Count Badge */}
      {!school.isLoading && (
        <div className="bg-destructive absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm">
          <span className="text-destructive-foreground text-sm font-bold">
            {school.totalPatients ?? school.studentCount ?? 0}
          </span>
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute right-0 bottom-0 left-0 z-10 p-6 text-center">
        <h3 className="mb-1 text-4xl leading-tight font-bold text-white">
          {school.name}
        </h3>
        {displayNickname && (
          <p className="mb-1 text-2xl font-medium text-white/95">
            {displayNickname}
          </p>
        )}
        {school.motto && (
          <p className="text-sm font-medium text-white/90 italic">
            {school.motto}
          </p>
        )}
      </div>
    </Button>
  );
}
