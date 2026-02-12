"use client";

import { useState, useCallback } from "react";
import { School, SchoolIcon } from "@/types/school";
import { CoverPage } from "@/types/curator";

export type CuratorPagesTabType = "cover-page" | "icons" | "lock-ins";

export function useCuratorPages() {
  const [activeTab, setActiveTab] = useState<CuratorPagesTabType>("cover-page");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [coverPages, setCoverPages] = useState<CoverPage[]>([]);
  const [icons, setIcons] = useState<SchoolIcon[]>([]);
  const [editingCoverPage, setEditingCoverPage] = useState<CoverPage | null>(
    null,
  );
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);

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

  const handleSchoolSelect = useCallback((school: School | null) => {
    setSelectedSchool(school);
    setShowSchoolModal(false);
  }, []);

  const handleClearSchool = useCallback(() => {
    setSelectedSchool(null);
  }, []);

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
          setShowAddIconModal(false);
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
          setShowAddIconModal(false);
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
            setShowAddIconModal(false);
          };
          reader.readAsDataURL(data.photo);
        }
      }
    },
    [editingIcon, selectedSchool],
  );

  const handleIconClick = useCallback((icon: SchoolIcon) => {
    setEditingIcon(icon);
    setShowAddIconModal(true);
  }, []);

  const openAddCoverPage = useCallback(() => {
    setEditingCoverPage(null);
    setShowAddModal(true);
  }, []);

  const closeAddCoverPage = useCallback(() => {
    setShowAddModal(false);
    setEditingCoverPage(null);
  }, []);

  const openAddIcon = useCallback(() => {
    setEditingIcon(null);
    setShowAddIconModal(true);
  }, []);

  const closeAddIcon = useCallback(() => {
    setShowAddIconModal(false);
    setEditingIcon(null);
  }, []);

  const tabs = [
    { id: "cover-page" as CuratorPagesTabType, label: "Cover Page" },
    { id: "icons" as CuratorPagesTabType, label: "Icons" },
    { id: "lock-ins" as CuratorPagesTabType, label: "Lock-ins" },
  ];

  const displayCoverPages = selectedSchool
    ? coverPages.filter((page) => page.schoolId === selectedSchool.id)
    : coverPages.filter((page) => page.schoolId === null);

  const displayIcons = selectedSchool
    ? icons.filter((icon) => icon.schoolId === selectedSchool.id)
    : icons.filter((icon) => icon.schoolId === null);

  return {
    // State
    activeTab,
    setActiveTab,
    selectedSchool,
    showSchoolModal,
    setShowSchoolModal,
    showAddModal,
    showAddIconModal,
    coverPages: displayCoverPages,
    icons: displayIcons,
    editingCoverPage,
    editingIcon,
    tabs,

    // Handlers
    handleCoverPageComplete,
    handleCoverPageClick,
    handleSchoolSelect,
    handleClearSchool,
    handleIconComplete,
    handleIconClick,
    openAddCoverPage,
    closeAddCoverPage,
    openAddIcon,
    closeAddIcon,
  };
}
