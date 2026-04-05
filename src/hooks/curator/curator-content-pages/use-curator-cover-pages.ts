"use client";

import { useState, useCallback, useMemo } from "react";
import { CoverPage } from "@/lib/types/curator";
import { School } from "@/lib/types/school";

export function useCuratorCoverPages(selectedSchool: School | null) {
  const [coverPages, setCoverPages] = useState<CoverPage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoverPage, setEditingCoverPage] = useState<CoverPage | null>(null);

  const handleCoverPageComplete = useCallback(
    (data: { photo: File | null; color: string; slogan: string }) => {
      const targetSchoolId = selectedSchool?.id || null;

      if (editingCoverPage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedCoverPage: CoverPage = {
            ...editingCoverPage,
            photo: data.photo || editingCoverPage.photo,
            photoPreview: data.photo
              ? (reader.result as string)
              : editingCoverPage.photoPreview,
            color: data.color,
            slogan: data.slogan,
          };
          setCoverPages((prev) =>
            prev.map((page) =>
              page.id === editingCoverPage.id ? updatedCoverPage : page,
            ),
          );
          setShowAddModal(false);
          setEditingCoverPage(null);
        };

        if (data.photo) {
          reader.readAsDataURL(data.photo);
        } else {
          const updatedCoverPage: CoverPage = {
            ...editingCoverPage,
            color: data.color,
            slogan: data.slogan,
          };
          setCoverPages((prev) =>
            prev.map((page) =>
              page.id === editingCoverPage.id ? updatedCoverPage : page,
            ),
          );
          setShowAddModal(false);
          setEditingCoverPage(null);
        }
      } else {
        if (data.photo) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newCoverPage: CoverPage = {
              id: Date.now().toString(),
              photo: data.photo!,
              photoPreview: reader.result as string,
              color: data.color,
              slogan: data.slogan,
              schoolId: targetSchoolId,
            };
            setCoverPages((prev) => [...prev, newCoverPage]);
            setShowAddModal(false);
          };
          reader.readAsDataURL(data.photo);
        }
      }
    },
    [editingCoverPage, selectedSchool],
  );

  const handleCoverPageClick = useCallback((coverPage: CoverPage) => {
    setEditingCoverPage(coverPage);
    setShowAddModal(true);
  }, []);

  const openAddCoverPage = useCallback(() => {
    setEditingCoverPage(null);
    setShowAddModal(true);
  }, []);

  const closeAddCoverPage = useCallback(() => {
    setShowAddModal(false);
    setEditingCoverPage(null);
  }, []);

  const displayCoverPages = useMemo(() => {
    return selectedSchool
      ? coverPages.filter((page) => page.schoolId === selectedSchool.id)
      : coverPages.filter((page) => page.schoolId === null);
  }, [coverPages, selectedSchool]);

  return {
    coverPages: displayCoverPages,
    showAddModal,
    setShowAddModal,
    editingCoverPage,
    setEditingCoverPage,
    handleCoverPageComplete,
    handleCoverPageClick,
    openAddCoverPage,
    closeAddCoverPage,
  };
}
