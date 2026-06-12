"use client";
import { m, AnimatePresence } from "motion/react";
import { SchoolCreationModalProps } from "@/lib/types/modals";
import { useSchoolCreation } from "@/hooks/components/modals/use-school-creation";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SchoolHeader } from "./school-creation/header";
import { StepIndicator } from "./school-creation/step-indicator";
import { FormStep } from "./school-creation/form-step";
import { PreviewStep } from "./school-creation/preview-step";
import { SchoolFooter } from "./school-creation/footer";

const SchoolCreationModal = ({
  isOpen,
  onClose,
  onSchoolCreated,
}: SchoolCreationModalProps) => {
  const {
    currentStep,
    showCampusDropdown,
    setShowCampusDropdown,
    selectedCampuses,
    formData,
    createSchoolMutation,
    campusDropdownRef,
    handleInputChange,
    handleCampusToggle,
    handleLogoUpload,
    handleRemoveLogo,
    handleNext,
    handleBack,
    handleConfirm,
    handleClose,
    isFormValid,
  } = useSchoolCreation({ onClose, onSchoolCreated });

  useClickOutside(campusDropdownRef, () => {
    setShowCampusDropdown(false);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-3xl"
            onClick={handleClose}
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground border-border mx-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
              <SchoolHeader
                currentStep={currentStep}
                handleClose={handleClose}
              />

              <StepIndicator currentStep={currentStep} />

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {currentStep === 1 ? (
                  <FormStep
                    formData={formData}
                    handleInputChange={handleInputChange}
                    showCampusDropdown={showCampusDropdown}
                    setShowCampusDropdown={setShowCampusDropdown}
                    selectedCampuses={selectedCampuses}
                    handleCampusToggle={handleCampusToggle}
                    campusDropdownRef={campusDropdownRef}
                    handleLogoUpload={handleLogoUpload}
                    handleRemoveLogo={handleRemoveLogo}
                  />
                ) : (
                  <PreviewStep
                    formData={formData}
                    selectedCampuses={selectedCampuses}
                  />
                )}
              </div>

              <SchoolFooter
                currentStep={currentStep}
                handleClose={handleClose}
                handleNext={handleNext}
                handleBack={handleBack}
                handleConfirm={handleConfirm}
                isFormValid={isFormValid}
                isPending={createSchoolMutation.isPending}
              />
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SchoolCreationModal;
