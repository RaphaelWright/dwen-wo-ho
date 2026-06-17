"use client";

import { useState, useCallback, useMemo } from "react";
import { SchoolIcon, School } from "@/lib/types/entities/school";

export function useCuratorIcons(selectedSchool: School | null) {
  const [icons, setIcons] = useState<SchoolIcon[]>([]);
  const [showAddIconWizard, setShowAddIconWizard] = useState(false);
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);

  const handleIconComplete = useCallback(
    (data: {
      photo: File | null;
      name: string;
      slogan: string;
      rank: number;
      lockIns: string[];
    }) => {
      const targetSchoolId = selectedSchool?.id || null;

      if (editingIcon) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedIcon: SchoolIcon = {
            ...editingIcon,
            photo: data.photo || editingIcon.photo,
            photoPreview: data.photo
              ? (reader.result as string)
              : editingIcon.photoPreview,
            name: data.name,
            slogan: data.slogan,
            rank: data.rank,
            lockIns: data.lockIns,
          };
          setIcons((prev) =>
            prev.map((icon) =>
              icon.id === editingIcon.id ? updatedIcon : icon,
            ),
          );
          setShowAddIconWizard(false);
          setEditingIcon(null);
        };

        if (data.photo) {
          reader.readAsDataURL(data.photo);
        } else {
          const updatedIcon: SchoolIcon = {
            ...editingIcon,
            name: data.name,
            slogan: data.slogan,
            rank: data.rank,
            lockIns: data.lockIns,
          };
          setIcons((prev) =>
            prev.map((icon) =>
              icon.id === editingIcon.id ? updatedIcon : icon,
            ),
          );
          setShowAddIconWizard(false);
          setEditingIcon(null);
        }
      } else {
        if (data.photo) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newIcon: SchoolIcon = {
              id: Date.now().toString(),
              photo: data.photo!,
              photoPreview: reader.result as string,
              name: data.name,
              slogan: data.slogan,
              rank: data.rank,
              schoolId: targetSchoolId,
              lockIns: data.lockIns,
            };
            setIcons((prev) => [...prev, newIcon]);
            setShowAddIconWizard(false);
          };
          reader.readAsDataURL(data.photo);
        }
      }
    },
    [editingIcon, selectedSchool],
  );

  const handleIconClick = useCallback((icon: SchoolIcon) => {
    setEditingIcon(icon);
    setShowAddIconWizard(true);
  }, []);

  const openAddIcon = useCallback(() => {
    setEditingIcon(null);
    setShowAddIconWizard(true);
  }, []);

  const closeAddIcon = useCallback(() => {
    setShowAddIconWizard(false);
    setEditingIcon(null);
  }, []);

  const displayIcons = useMemo(() => {
    return selectedSchool
      ? icons.filter((icon) => icon.schoolId === selectedSchool.id)
      : icons.filter((icon) => icon.schoolId === null);
  }, [icons, selectedSchool]);

  return {
    icons: displayIcons,
    showAddIconWizard,
    setShowAddIconWizard,
    editingIcon,
    setEditingIcon,
    handleIconComplete,
    handleIconClick,
    openAddIcon,
    closeAddIcon,
  };
}
