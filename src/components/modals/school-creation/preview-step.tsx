import { MapPin } from "lucide-react";
import Image from "next/image";
import { PreviewStepProps } from "@/lib/types/components/modals/school-creation";

export const PreviewStep = ({
  formData,
  selectedCampuses,
}: PreviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted space-y-4 rounded-xl p-6">
        <div className="flex items-start gap-4">
          {formData.logo ? (
            <div className="border-border h-20 w-20 shrink-0 overflow-hidden rounded-xl border">
              <Image
                src={URL.createObjectURL(formData.logo)}
                alt="School logo"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center rounded-xl">
              <span className="text-muted-foreground text-2xl font-bold">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-foreground mb-1 text-2xl font-bold">
              {formData.name}
            </h3>
            {formData.nickname && (
              <p className="text-muted-foreground text-lg font-medium">
                &quot;{formData.nickname}&quot;
              </p>
            )}
            {formData.motto && (
              <p className="text-muted-foreground mt-1 text-sm italic">
                &quot;{formData.motto}&quot;
              </p>
            )}
            <span className="bg-secondary-accent/10 text-secondary-accent mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold">
              {formData.type}
            </span>
          </div>
        </div>

        {selectedCampuses.length > 0 && (
          <div className="border-border border-t pt-4">
            <div className="flex items-start gap-2">
              <MapPin className="text-secondary-accent mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-foreground mb-2 text-sm font-semibold">
                  Campuses:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCampuses.map((campus) => (
                    <span
                      key={campus}
                      className="bg-card border-border text-foreground rounded-lg border px-3 py-1 text-sm"
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

      <div className="bg-secondary/10 border-secondary/20 rounded-xl border p-4">
        <p className="text-secondary-foreground text-sm">
          Please review all information carefully. Once confirmed, the school
          will be created and added to the system.
        </p>
      </div>
    </div>
  );
};
