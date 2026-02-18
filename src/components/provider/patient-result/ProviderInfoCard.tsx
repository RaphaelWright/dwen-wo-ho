"use client";

import { ProviderInfoCardProps } from "@/lib/types/provider/patient-result";
import { getProviderSections } from "@/lib/constants/patient-result";

export function ProviderInfoCard({ patientResult }: ProviderInfoCardProps) {
  const sections = getProviderSections(patientResult);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Provider Information
      </h2>
      {sections.map((section) => (
        <div key={section.key} className="mb-4 last:mb-0">
          <p className="text-sm text-gray-500 mb-1">{section.title}</p>
          <div className="space-y-2">
            {section.providers.map((provider, index) => (
              <div key={provider.id || index}>
                <p className="font-semibold text-gray-900">
                  {provider.professionalTitle &&
                    `${provider.professionalTitle} `}
                  {provider.name}
                </p>
                {provider.subtext && (
                  <p className="text-sm text-gray-600">{provider.subtext}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
