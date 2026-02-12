"use client";

import Image from "next/image";
import Link from "next/link";
import { MdSchool } from "react-icons/md";
import { ROUTES } from "@/lib/constants/routes";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { getFirstCampus } from "@/hooks/curator/useCuratorSchools";

interface SchoolCardProps {
  school: SchoolWithExtras;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const firstCampus = getFirstCampus(school.campuses);
  const displayNickname = school.nickname
    ? firstCampus
      ? `${school.nickname} (${firstCampus})`
      : school.nickname
    : firstCampus
      ? `(${firstCampus})`
      : "";

  return (
    <Link
      href={`${ROUTES.curator.schools}/${school.id}`}
      className="relative group h-80 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300 block"
    >
      {/* Background Image */}
      {school.logo ? (
        <div className="absolute inset-0">
          <Image
            src={school.logo}
            alt={school.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <MdSchool className="w-20 h-20 text-gray-400" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      {/* Loading Indicator */}
      {school.isLoading && (
        <div className="absolute top-4 left-4 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
        </div>
      )}

      {/* Top Left - New Patient Alert */}
      {school.newPatientName && !school.isLoading && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 shadow-md border-none w-60">
          <span className="text-base font-semibold block truncate">
            <span className="text-[#e92229]">New Patient.</span>{" "}
            <span className="text-black">{school.newPatientName}</span>
          </span>
        </div>
      )}

      {/* Top Right - Student Count Badge */}
      {!school.isLoading && (
        <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-[#e92229] backdrop-blur-sm flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">
            {school.studentCount ?? 0}
          </span>
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
        <h3 className="text-white font-bold text-4xl mb-1 leading-tight">
          {school.name}
        </h3>
        {displayNickname && (
          <p className="text-white/95 text-2xl font-medium mb-1">
            {displayNickname}
          </p>
        )}
        {school.motto && (
          <p className="text-white/90 text-sm font-medium italic">
            {school.motto}
          </p>
        )}
      </div>
    </Link>
  );
}
