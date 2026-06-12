import { Award } from "lucide-react";
import { ProviderSpecialtiesCardProps } from "@/lib/types/components/curator/provider-details";

export function ProviderSpecialtiesCard({
  specialties,
}: ProviderSpecialtiesCardProps) {
  if (specialties.length === 0) return null;

  return (
    <div className="bg-card border-border mb-8 overflow-hidden rounded-lg border shadow-lg">
      <div className="px-6 py-6">
        <h2 className="text-foreground mb-4 flex items-center text-xl font-bold">
          <Award className="mr-2 h-6 w-6" />
          Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <span
              key={specialty}
              className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
