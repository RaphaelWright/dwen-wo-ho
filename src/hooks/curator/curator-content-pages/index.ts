"use client";

import { useCuratorTabs } from "./use-curator-tabs";
import { useCuratorSchoolSelection } from "./use-curator-school-selection";
import { useCuratorCoverPages } from "./use-curator-cover-pages";
import { useCuratorIcons } from "./use-curator-icons";

export type { CuratorPagesTabType } from "./use-curator-tabs";

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
    showAddIconModal,
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
    showAddIconModal,
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
