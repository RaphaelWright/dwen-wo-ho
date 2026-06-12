"use client";

import { useMemo } from "react";
import { AssociatedSchool, AssociatedProvider } from "@/lib/types/partners";
import { School } from "@/lib/types/school";
import { Provider } from "@/lib/types/provider";

interface UsePartnerAvailabilityProps {
  allSchools: School[];
  providersList: Provider[];
  associatedSchools: AssociatedSchool[];
  associatedProviders: AssociatedProvider[];
}

export const usePartnerAvailability = ({
  allSchools,
  providersList,
  associatedSchools,
  associatedProviders,
}: UsePartnerAvailabilityProps) => {
  const availableSchools = useMemo(() => {
    const associatedSchoolIds = new Set(
      associatedSchools.map((s) => String(s.id)),
    );
    return allSchools.flatMap((s) =>
      associatedSchoolIds.has(String(s.id))
        ? []
        : [{ id: s.id, name: s.name, logo: s.logo || undefined }],
    );
  }, [allSchools, associatedSchools]);

  const availableProviders = useMemo(() => {
    const associatedProviderIds = new Set(
      associatedProviders.map((p) => p.email),
    );
    return providersList.flatMap((p) =>
      associatedProviderIds.has(p.email)
        ? []
        : [
            {
              id: p.email,
              email: p.email,
              providerName: p.providerName ?? p.email,
              providerTitle: p.providerTitle ?? undefined,
              specialty: p.specialty ?? undefined,
              profilePhotoURL: p.profilePhotoURL ?? undefined,
            },
          ],
    );
  }, [providersList, associatedProviders]);

  return {
    availableSchools,
    availableProviders,
  };
};
