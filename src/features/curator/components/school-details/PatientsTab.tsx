"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Patient {
  id: number | string;
  lockinId: number;
  patientName: string;
  lockinScore?: number;
  comment: string | null;
  createdAt?: string;
  visibilityStatus?: string;
  treatingProviders?: Array<{ id: string; fullName: string }>;
}

interface PatientsTabProps {
  patients: Patient[];
  isLoading: boolean;
  schoolId: string;
  compactTimeAgo: (date: string) => string;
  onViewPatient: (patientId: number | string) => void;
}

export function PatientsTab({
  patients,
  isLoading,
  compactTimeAgo,
  onViewPatient,
}: PatientsTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4]" />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-900 font-medium">No patients found</p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or add a new patient.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {patients.map((patient) => {
        const isTreating = (patient.treatingProviders?.length ?? 0) > 0;
        const isSeen = patient.visibilityStatus === "SEEN";

        return (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-[#955aa4]/30 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center"
          >
            {/* Lock-in score Badge */}
            <div
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                patient.lockinScore != null
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-400",
              )}
            >
              <span className="font-bold text-2xl sm:text-3xl">
                {patient.lockinScore != null
                  ? patient.lockinScore.toFixed(1)
                  : "–"}
              </span>
            </div>

            {/* Patient info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl group-hover:text-[#955aa4] transition-colors">
                  {patient.patientName}
                </h3>
                <span className="text-xs font-medium text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                  {compactTimeAgo(patient.createdAt || "")} ago
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {patient.comment ? (
                  <span className="italic">&quot;{patient.comment}&quot;</span>
                ) : (
                  <span className="text-gray-400 italic">No comments</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                    isTreating
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : isSeen
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-green-50 text-green-700 border border-green-100",
                  )}
                >
                  {isTreating ? "Treating" : isSeen ? "Opened" : "New"}
                </div>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={() => onViewPatient(patient.id)}
              className={cn(
                "sm:self-center shrink-0 rounded-lg px-6 w-full sm:w-auto",
                isTreating || isSeen
                  ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  : "bg-black text-white hover:bg-gray-800",
              )}
            >
              {isTreating || isSeen ? "View Details" : "Open Case"}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
