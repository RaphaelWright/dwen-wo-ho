import { compactTimeAgo } from "@/lib/utils/shared/time-ago";
import type { PatientCardInfoProps } from "@/lib/types/components/shared/patient-card";

export function PatientCardInfo({
  patientName,
  time,
  schoolNickname,
  schoolName,
  preview,
  statusLabel,
  statusClassName,
}: PatientCardInfoProps) {
  return (
    <div className="min-w-0 flex-1">
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

      <p className="text-muted-foreground/80 mt-0.5 line-clamp-1 text-[12.5px] leading-snug">
        {preview || ""}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded border px-2 py-0.75 text-[10.5px] font-bold tracking-wide uppercase ${statusClassName}`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
