"use client";

import { Award } from "lucide-react";

interface ProviderSpecialtiesCardProps {
  specialties: string[];
}

export function ProviderSpecialtiesCard({
  specialties,
}: ProviderSpecialtiesCardProps) {
  if (specialties.length === 0) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2" />
          Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#955aa4] text-white rounded-full text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
