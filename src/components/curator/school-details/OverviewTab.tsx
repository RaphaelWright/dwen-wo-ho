"use client";

import { Calendar, Quote } from "lucide-react";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { parseCampuses } from "@/lib/utils/parseCampuses";
import { OverviewTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const OverviewTab = ({ school }: OverviewTabProps) => {
  const parsedCampuses = parseCampuses(school.campuses);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          School Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MdSchool className="w-5 h-5 text-[#955aa4] mt-1" />
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{school.type}</p>
            </div>
          </div>
          {school.motto && (
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-[#955aa4] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Motto</p>
                <p className="font-medium italic">&quot;{school.motto}&quot;</p>
              </div>
            </div>
          )}
          {parsedCampuses.length > 0 && (
            <div className="flex items-start gap-3">
              <MdLocationOn className="w-5 h-5 text-[#955aa4] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Campuses</p>
                <ul className="list-disc list-inside font-medium space-y-1">
                  {parsedCampuses.map((campus, index) => (
                    <li key={index}>{campus}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {school.createdAt && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#955aa4] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(school.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
