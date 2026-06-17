"use client";

import { useCuratorTabs } from "./use-tabs";
import { useCuratorSchoolSelection } from "./use-school-selection";
import { useCuratorCoverPages } from "./use-cover-pages";
import { useCuratorIcons } from "./use-icons";

export function useCuratorContentPages() {
  const { activeTab, setActiveTab, tabs } = useCuratorTabs();

  const {
    selectedSchool,
    showSchoolModal,
    setShowSchoolModal,
    handleSchoolSelect,
    handleClearSchool,
  } = useCuratorSchoolSelection();

  const {
    coverPages,
    showAddModal,
    editingCoverPage,
    handleCoverPageComplete,
    handleCoverPageClick,
    openAddCoverPage,
    closeAddCoverPage,
  } = useCuratorCoverPages(selectedSchool);

  const {
    icons,
    showAddIconWizard,
    editingIcon,
    handleIconComplete,
    handleIconClick,
    openAddIcon,
    closeAddIcon,
  } = useCuratorIcons(selectedSchool);

  return {
    // State
    activeTab,
    setActiveTab,
    selectedSchool,
    showSchoolModal,
    setShowSchoolModal,
    showAddModal,
    showAddIconWizard,
    coverPages,
    icons,
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

export type CuratorContentPagesState = ReturnType<
  typeof useCuratorContentPages
>;
