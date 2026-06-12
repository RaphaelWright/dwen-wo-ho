"use client";
import { AnimatePresence, m } from "motion/react";
import { SchoolEditModalProps } from "@/lib/types/modals";
import { useSchoolEdit } from "@/hooks/components/modals/use-school-edit";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SchoolEditHeader } from "./school-edit/header";
import { SchoolEditForm } from "./school-edit/form";
import { SchoolEditFooter } from "./school-edit/footer";

const SchoolEditModal = ({
  isOpen,
  onClose,
  school,
  onSchoolUpdated,
  onDisableSchool,
}: SchoolEditModalProps) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border-border mx-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border shadow-2xl">
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
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SchoolEditModal;
