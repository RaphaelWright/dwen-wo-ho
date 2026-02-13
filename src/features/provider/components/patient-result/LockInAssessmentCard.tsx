import { LockInAssessmentCardProps } from "@/features/provider/types/patient-result";
import { getLockInAssessmentMetrics } from "@/lib/constants/patient-result";

export function LockInAssessmentCard({
  lockInAssessment,
  getColorClass,
}: LockInAssessmentCardProps) {
  const metrics = getLockInAssessmentMetrics(lockInAssessment);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Lock-In Assessment
      </h2>
      <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg mb-4">
        <p className="text-sm text-gray-500 mb-2">Overall Lock-In Score</p>
        <p
          className={`text-2xl font-bold ${getColorClass(
            lockInAssessment.lockedInColor,
          )} px-4 py-2 rounded inline-block`}
        >
          {lockInAssessment.lockedInScore} / 10
        </p>
        <p className="text-lg font-semibold text-gray-900 mt-2">
          {lockInAssessment.lockedInScoreDescription}
        </p>
      </div>

      {lockInAssessment.generalMentalHealth !== "N/A" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
              <p
                className={`text-lg font-bold ${getColorClass(
                  metric.color,
                )} px-3 py-1 rounded inline-block`}
              >
                {metric.value} ({metric.score})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
