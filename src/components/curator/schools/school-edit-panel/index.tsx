"use client";

import { SchoolEditPanelProps } from "@/lib/types/components/shared/overlays";
import { useSchoolEdit } from "@/hooks/components/curator/schools/use-school-edit";
import { useClickOutside } from "@/hooks/shared/use-click-outside";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { SchoolEditHeader } from "./header";
import { SchoolEditForm } from "./form";
import { SchoolEditFooter } from "./footer";

const SchoolEditPanel = ({
  isOpen,
  onClose,
  school,
  onSchoolUpdated,
  onDisableSchool,
}: SchoolEditPanelProps) => {
  const {
    showCampusDropdown,
    setShowCampusDropdown,
    selectedCampuses,
    formData,
    updateSchoolMutation,
    campusDropdownRef,
    hasChanges,
    handleInputChange,
    handleCampusToggle,
    handleSubmit,
    handleDisable,
  } = useSchoolEdit({ school, onClose, onSchoolUpdated, onDisableSchool });

  useClickOutside(campusDropdownRef, () => {
    setShowCampusDropdown(false);
  });

  return (
    <AnimatedModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      panelClassName="max-h-[90vh] max-w-2xl rounded-3xl"
    >
      <SchoolEditHeader onClose={onClose} />

      <div className="no-scrollbar flex-1 overflow-y-auto p-8">
        <SchoolEditForm
          formData={formData}
          handleInputChange={handleInputChange}
          showCampusDropdown={showCampusDropdown}
          setShowCampusDropdown={setShowCampusDropdown}
          selectedCampuses={selectedCampuses}
          handleCampusToggle={handleCampusToggle}
          campusDropdownRef={campusDropdownRef}
          handleSubmit={handleSubmit}
          school={school}
        />
      </div>

      <SchoolEditFooter
        handleDisable={handleDisable}
        isPending={updateSchoolMutation.isPending}
        hasChanges={hasChanges}
      />
    </AnimatedModalShell>
  );
};

export default SchoolEditPanel;
