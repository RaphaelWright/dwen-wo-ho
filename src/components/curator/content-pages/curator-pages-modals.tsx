"use client";

import SchoolSelectionModal from "@/components/modals/school-selection-pages";
import AddCoverPageModal from "@/components/modals/add-cover-page";
import AddIconModal from "@/components/modals/add-icon";
import type { CuratorPagesModalsProps } from "@/lib/types/components/curator/content-pages";

export default function CuratorPagesModals({ pages }: CuratorPagesModalsProps) {
  const {
    showSchoolModal,
    setShowSchoolModal,
    showAddModal,
    showAddIconModal,
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
      <SchoolSelectionModal
        isOpen={showSchoolModal}
        onClose={() => setShowSchoolModal(false)}
        onSelect={handleSchoolSelect}
      />

      <AddCoverPageModal
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

      <AddIconModal
        isOpen={showAddIconModal}
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
