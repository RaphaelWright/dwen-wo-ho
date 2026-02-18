import { PatientInfoCardProps } from "@/lib/types/provider/patient-result";
import { getPatientInfoDetails } from "@/lib/constants/patient-result";

export function PatientInfoCard({ patientResult }: PatientInfoCardProps) {
  const patientDetails = getPatientInfoDetails(patientResult);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Patient Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patientDetails.map((detail, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{detail.label}</p>
            <p className="font-semibold text-gray-900">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
