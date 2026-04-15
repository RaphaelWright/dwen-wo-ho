import { Award } from "lucide-react";
import { ProviderSpecialtiesCardProps } from "@/lib/types/components/curator/provider-details";

export function ProviderSpecialtiesCard({
  specialties,
}: ProviderSpecialtiesCardProps) {
  if (specialties.length === 0) return null;

  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden mb-8 border border-border">
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2" />
          Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
