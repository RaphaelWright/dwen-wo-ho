"use client";

import SchoolSelectionPicker from "@/components/curator/content-pages/overlays/school-selection-picker";
import AddCoverPageWizard from "@/components/curator/content-pages/overlays/add-cover-page-wizard";
import AddIconWizard from "@/components/curator/content-pages/overlays/add-icon-wizard";
import type { ContentPagesOverlayHostProps } from "@/lib/types/components/curator/content-pages/content-pages";
import type { CuratorContentPagesState } from "@/hooks/curator/content-pages";

export default function ContentPagesOverlayHost({
  pages,
}: ContentPagesOverlayHostProps<CuratorContentPagesState>) {
  const {
    showSchoolModal,
    setShowSchoolModal,
    showAddModal,
    showAddIconWizard,
    editingCoverPage,
    editingIcon,
    selectedSchool,
    handleSchoolSelect,
    handleCoverPageComplete,
    handleIconComplete,
    closeAddCoverPage,
    closeAddIcon,
  } = pages;

  return (
    <>
      <SchoolSelectionPicker
        isOpen={showSchoolModal}
        onClose={() => setShowSchoolModal(false)}
        onSelect={handleSchoolSelect}
      />

      <AddCoverPageWizard
        isOpen={showAddModal}
        onClose={closeAddCoverPage}
        onComplete={handleCoverPageComplete}
        editData={
          editingCoverPage
            ? {
                photoPreview: editingCoverPage.photoPreview,
                color: editingCoverPage.color,
                slogan: editingCoverPage.slogan,
              }
            : null
        }
      />

      <AddIconWizard
        isOpen={showAddIconWizard}
        onClose={closeAddIcon}
        onComplete={handleIconComplete}
        editData={
          editingIcon
            ? {
                photoPreview: editingIcon.photoPreview,
                name: editingIcon.name,
                slogan: editingIcon.slogan,
                rank: editingIcon.rank,
                lockIns: editingIcon.lockIns || [],
              }
            : null
        }
        selectedSchool={selectedSchool}
      />
    </>
  );
}
