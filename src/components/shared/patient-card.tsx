"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { getScoreColor, getStatusConfig } from "@/lib/utils/new-provider";
import ScoreRing from "./score-ring";
import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details";
import type { PatientCase } from "@/lib/types/api/patient-results";
import { Checkbox } from "../ui/checkbox";

/**
 * A single row in the patient list.
 * Generic component that works with both SchoolPatientRecord and PatientCase types.
 *
 * @example
 * // Using with SchoolPatientRecord (uses default accessors)
 * <PatientCard<SchoolPatientRecord> patient={record} />
 *
 * @example
 * // Using with PatientCase (provide custom accessors)
 * <PatientCard<PatientCase>
 *   patient={patientCase}
 *   getId={(p) => p.patientId}
 *   getScore={(p) => p.score}
 *   getStatus={(p) => p.status}
 *   getTime={(p) => p.time}
 *   getPreview={(p) => p.preview}
 * />
 */

export interface PatientCardProps<T> {
  patient: T;
  index?: number;
  onActionClick?: (id: string | number) => void;
  detailRoute?: (patientId: string | number) => string;
  /** Extract the unique identifier from the patient object */
  getId?: (patient: T) => string | number;
  /** Extract the lockin score from the patient object */
  getScore?: (patient: T) => number;
  /** Extract the visibility status from the patient object */
  getStatus?: (patient: T) => string;
  /** Extract the timestamp from the patient object */
  getTime?: (patient: T) => string;
  /** Extract the preview/comment text from the patient object */
  getPreview?: (patient: T) => string | null | undefined;
  /** Extract the patient name from the patient object */
  getPatientName?: (patient: T) => string;
  /** Extract the school nickname from the patient object */
  getSchoolNickname?: (patient: T) => string | undefined;
  /** Extract the school name from the patient object */
  getSchoolName?: (patient: T) => string;
  selectedPatients?: Set<string | number>;
  handleSelectPatient?: (id: string | number, checked: boolean) => void;
  showCheckbox: boolean;
}

// Default accessors for SchoolPatientRecord
const defaultSchoolPatientRecordAccessors = {
  getId: (p: SchoolPatientRecord) => p.id,
  getScore: (p: SchoolPatientRecord) => p.lockinScore,
  getStatus: (p: SchoolPatientRecord) => p.visibilityStatus,
  getTime: (p: SchoolPatientRecord) => p.createdAt,
  getPreview: (p: SchoolPatientRecord) => p.comment,
  getPatientName: (p: SchoolPatientRecord) => p.patientName,
  getSchoolNickname: (p: SchoolPatientRecord) => p.schoolNickname,
  getSchoolName: (p: SchoolPatientRecord) => p.schoolName,
};

// Default accessors for PatientCase
const defaultPatientCaseAccessors = {
  getId: (p: PatientCase) => p.patientId,
  getScore: (p: PatientCase) => p.score,
  getStatus: (p: PatientCase) => p.status,
  getTime: (p: PatientCase) => p.time,
  getPreview: (p: PatientCase) => p.preview,
  getPatientName: (p: PatientCase) => p.patientName,
  getSchoolNickname: (p: PatientCase) => p.schoolNickname,
  getSchoolName: (p: PatientCase) => p.schoolName,
};

export default function PatientCard<
  T extends SchoolPatientRecord | PatientCase,
>({
  patient,
  index = 0,
  onActionClick,
  detailRoute,
  getId,
  getScore,
  getStatus,
  getTime,
  getPreview,
  getPatientName,
  getSchoolNickname,
  getSchoolName,
  handleSelectPatient,
  selectedPatients,
  showCheckbox = false,
}: PatientCardProps<T>) {
  const router = useRouter();

  // Determine if we're dealing with PatientCase by checking for patientId field
  const isPatientCase =
    patient && typeof patient === "object" && "patientId" in patient;

  // Use provided accessors or defaults based on type
  const accessors = isPatientCase
    ? {
        getId:
          getId ??
          (defaultPatientCaseAccessors.getId as (p: T) => string | number),
        getScore:
          getScore ??
          (defaultPatientCaseAccessors.getScore as (p: T) => number),
        getStatus:
          getStatus ??
          (defaultPatientCaseAccessors.getStatus as (p: T) => string),
        getTime:
          getTime ?? (defaultPatientCaseAccessors.getTime as (p: T) => string),
        getPreview:
          getPreview ??
          (defaultPatientCaseAccessors.getPreview as (
            p: T,
          ) => string | null | undefined),
        getPatientName:
          getPatientName ??
          (defaultPatientCaseAccessors.getPatientName as (p: T) => string),
        getSchoolNickname:
          getSchoolNickname ??
          (defaultPatientCaseAccessors.getSchoolNickname as (
            p: T,
          ) => string | undefined),
        getSchoolName:
          getSchoolName ??
          (defaultPatientCaseAccessors.getSchoolName as (p: T) => string),
      }
    : {
        getId:
          getId ??
          (defaultSchoolPatientRecordAccessors.getId as (
            p: T,
          ) => string | number),
        getScore:
          getScore ??
          (defaultSchoolPatientRecordAccessors.getScore as (p: T) => number),
        getStatus:
          getStatus ??
          (defaultSchoolPatientRecordAccessors.getStatus as (p: T) => string),
        getTime:
          getTime ??
          (defaultSchoolPatientRecordAccessors.getTime as (p: T) => string),
        getPreview:
          getPreview ??
          (defaultSchoolPatientRecordAccessors.getPreview as (
            p: T,
          ) => string | null | undefined),
        getPatientName:
          getPatientName ??
          (defaultSchoolPatientRecordAccessors.getPatientName as (
            p: T,
          ) => string),
        getSchoolNickname:
          getSchoolNickname ??
          (defaultSchoolPatientRecordAccessors.getSchoolNickname as (
            p: T,
          ) => string | undefined),
        getSchoolName:
          getSchoolName ??
          (defaultSchoolPatientRecordAccessors.getSchoolName as (
            p: T,
          ) => string),
      };

  const id = accessors.getId(patient);
  const score = accessors.getScore(patient);
  const status = accessors.getStatus(patient);
  const time = accessors.getTime(patient);
  const preview = accessors.getPreview(patient);
  const patientName = accessors.getPatientName(patient);
  const schoolNickname = accessors.getSchoolNickname(patient);
  const schoolName = accessors.getSchoolName(patient);

  const cfg = getStatusConfig(status || "new");
  const scoreColor = getScoreColor(score || 0);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(id);
    } else if (detailRoute) {
      router.push(detailRoute(id) as Parameters<typeof router.push>[0]);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.03, 0.15),
        ease: "easeOut",
      }}
      whileHover={{
        x: 3,
        boxShadow: `-2px 0 0 0 ${scoreColor}`,
        transition: { duration: 0.15 },
      }}
      className="bg-card relative z-1 flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border px-5 py-4"
    >
      {/* Content */}
      <div className="relative z-10 flex w-full items-center gap-4">
        <ScoreRing score={score || 0} />

        <div className="min-w-0 flex-1">
          {/* Name + time */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold">
              {patientName || "Unknown"}
            </span>
            <span className="text-muted-foreground text-xs">
              {compactTimeAgo(time || "")} ago
            </span>
            <span className="border-info/25 text-info bg-info/10 max-w-30 truncate rounded border px-2 py-0.75 text-[10.5px] font-bold tracking-wide uppercase dark:text-blue-300">
              {schoolNickname || schoolName}
            </span>
          </div>

          {/* Preview */}
          <p className="text-muted-foreground/80 mt-0.5 line-clamp-1 text-[12.5px] leading-snug">
            {preview || ""}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded border px-2 py-0.75 text-[10.5px] font-bold tracking-wide uppercase ${cfg.cls}`}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Action button */}
        <m.button
          onClick={handleActionClick}
          whileHover={{
            scale: 1.03,
            backgroundColor: "var(--primary)",
            color: "#ffff",
          }}
          whileTap={{ scale: 0.97 }}
          className="bg-card shrink-0 cursor-pointer rounded-xl border px-4 py-1.5 text-[12px] font-semibold transition-all duration-300 ease-in-out"
        >
          {cfg.actionLabel}
        </m.button>
        {showCheckbox && (
          <Checkbox
            id={`patient-${id}-checkbox`}
            name={`patient-${id}-checkbox`}
            checked={selectedPatients?.has(id)}
            onCheckedChange={(checked) =>
              handleSelectPatient?.(id, checked === true)
            }
            className="bg-background border-primary"
          />
        )}
      </div>
    </m.div>
  );
}
