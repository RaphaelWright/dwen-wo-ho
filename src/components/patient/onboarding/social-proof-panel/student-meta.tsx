import { StudentMetaProps } from "@/lib/types/components/patient/onboarding";

export function StudentMeta({ programme, school }: StudentMetaProps) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-base leading-snug font-semibold text-white lg:text-lg">
        {programme}
      </p>
      <p className="text-sm text-white/45 lg:text-base">{school}</p>
    </div>
  );
}
