import { MapPin } from "lucide-react";
import Image from "next/image";
import { PreviewStepProps } from "@/lib/types/components/modals/school-creation";

export const PreviewStep = ({
  formData,
  selectedCampuses,
}: PreviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          {formData.logo ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image
                src={URL.createObjectURL(formData.logo)}
                alt="School logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
              <span className="text-gray-400 text-2xl font-bold">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formData.name}
            </h3>
            {formData.nickname && (
              <p className="text-lg text-gray-600 font-medium">
                &quot;{formData.nickname}&quot;
              </p>
            )}
            {formData.motto && (
              <p className="text-sm text-gray-500 italic mt-1">
                &quot;{formData.motto}&quot;
              </p>
            )}
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary">
              {formData.type}
            </span>
          </div>
        </div>

        {selectedCampuses.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Campuses:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCampuses.map((campus) => (
                    <span
                      key={campus}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                    >
                      {campus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
        <p className="text-sm text-secondary-foreground">
          Please review all information carefully. Once confirmed, the school
          will be created and added to the system.
        </p>
      </div>
    </div>
  );
};
