"use client";

import { useState, useCallback } from "react";
import { SchoolIcon } from "@/lib/types/school";

export interface IconFormData {
  photo: File | null;
  name: string;
  slogan: string;
  rank: number;
  lockIns: string[];
}

export function useSchoolIcons() {
  const [icons, setIcons] = useState<SchoolIcon[]>([]);

  const addOrUpdateIcon = useCallback(
    (
      data: IconFormData,
      editingIcon: SchoolIcon | null,
      schoolId: number | null,
      onComplete: () => void
    ) => {
      if (editingIcon) {
        const updated: SchoolIcon = {
          ...editingIcon,
          name: data.name,
          slogan: data.slogan,
          rank: data.rank,
          lockIns: data.lockIns,
        };
        if (data.photo) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updated.photoPreview = reader.result as string;
            setIcons((prev) =>
              prev.map((i) => (i.id === editingIcon.id ? updated : i)),
            );
            onComplete();
          };
          reader.readAsDataURL(data.photo);
        } else {
          setIcons((prev) =>
            prev.map((i) => (i.id === editingIcon.id ? updated : i)),
          );
          onComplete();
        }
      } else if (data.photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newIcon: SchoolIcon = {
            id: Date.now().toString(),
            photo: data.photo!,
            photoPreview: reader.result as string,
            name: data.name,
            slogan: data.slogan,
            rank: data.rank,
            schoolId: schoolId,
            lockIns: data.lockIns,
          };
          setIcons((prev) => [...prev, newIcon]);
          onComplete();
        };
        reader.readAsDataURL(data.photo);
      }
    },
    [],
  );

  return { icons, setIcons, addOrUpdateIcon };
}
