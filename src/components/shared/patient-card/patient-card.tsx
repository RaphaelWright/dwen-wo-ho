"use client";

import { m } from "motion/react";
import { useRouter } from "next/navigation";
import {
  getScoreColor,
  getStatusConfig,
} from "@/lib/utils/shared/patient-case-visuals";
import ScoreRing from "@/components/shared/score-ring";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  PatientCardPatient,
  PatientCardProps,
} from "@/lib/types/components/shared/patient-card";
import { resolvePatientCardFields } from "./patient-card-accessors";
import { PatientCardInfo } from "./patient-card-info";
import { PatientCardAction } from "./patient-card-action";

/**
 * A single row in the patient list.
 * Generic component that works with both SchoolPatientRecord and PatientCase types.
 */
export default function PatientCard<T extends PatientCardPatient>({
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

  const fields = resolvePatientCardFields(patient, {
    getId,
    getScore,
    getStatus,
    getTime,
    getPreview,
    getPatientName,
    getSchoolNickname,
    getSchoolName,
  });

  const cfg = getStatusConfig(fields.status || "new");
  const scoreColor = getScoreColor(fields.score || 0);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(fields.id);
    } else if (detailRoute) {
      router.push(detailRoute(fields.id) as Parameters<typeof router.push>[0]);
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
      <div className="relative z-10 flex w-full items-center gap-4">
        <ScoreRing score={fields.score || 0} />

        <PatientCardInfo
          patientName={fields.patientName}
          time={fields.time}
          schoolNickname={fields.schoolNickname}
          schoolName={fields.schoolName}
          preview={fields.preview}
          statusLabel={cfg.label}
          statusClassName={cfg.cls}
        />

        <PatientCardAction
          actionLabel={cfg.actionLabel}
          onClick={handleActionClick}
        />

        {showCheckbox && (
          <Checkbox
            id={`patient-${fields.id}-checkbox`}
            name={`patient-${fields.id}-checkbox`}
            checked={selectedPatients?.has(fields.id)}
            onCheckedChange={(checked) =>
              handleSelectPatient?.(fields.id, checked === true)
            }
            className="bg-background border-primary"
          />
        )}
      </div>
    </m.div>
  );
}
