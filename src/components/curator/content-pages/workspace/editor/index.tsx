"use client";

import type { ContentPagesWorkspaceProps } from "@/lib/types/components/curator/content-pages/content-pages";
import type { CuratorContentPagesState } from "@/hooks/curator/content-pages";
import { CoverPageTab } from "../tabs/cover-page-tab";
import { LockInsEmptyState } from "../tabs/lock-ins-empty-state";
import { IconsTab } from "../tabs/icons-tab";
import { SchoolSelectorButton } from "../school-selector-button";

export default function ContentPagesWorkspace({
  pages,
}: ContentPagesWorkspaceProps<CuratorContentPagesState>) {
  const {
    activeTab,
    selectedSchool,
    setShowSchoolModal,
    coverPages: displayCoverPages,
    icons: displayIcons,
    handleCoverPageClick,
    handleIconClick,
    openAddCoverPage,
    openAddIcon,
  } = pages;

  return (
    <>
      {activeTab === "cover-page" && (
        <CoverPageTab
          coverPages={displayCoverPages}
          onCoverPageClick={handleCoverPageClick}
          onAddCoverPage={openAddCoverPage}
        />
      )}

      {activeTab === "lock-ins" && <LockInsEmptyState />}

      {activeTab === "icons" && (
        <IconsTab
          icons={displayIcons}
          onIconClick={handleIconClick}
          onAddIcon={openAddIcon}
        />
      )}

      {(activeTab === "cover-page" || activeTab === "icons") && (
        <SchoolSelectorButton
          selectedSchoolName={selectedSchool?.name}
          onOpenSchoolModal={() => setShowSchoolModal(true)}
        />
      )}
    </>
  );
}
