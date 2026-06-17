"use client";

import { SchoolCreateModalProps } from "@/lib/types/components/shared/overlays";
import { useSchoolCreation } from "@/hooks/components/curator/create/use-school-creation";
import { useClickOutside } from "@/hooks/shared/use-click-outside";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { SchoolHeader } from "./header";
import { StepIndicator } from "./step-indicator";
import { FormStep } from "./form-step";
import { PreviewStep } from "./preview-step";
import { SchoolFooter } from "./footer";

const SchoolCreateModal = ({
  isOpen,
  onClose,
  onSchoolCreated,
}: SchoolCreateModalProps) => {
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
    <AnimatedModalShell
      isOpen={isOpen}
      onClose={handleClose}
      panelClassName="max-h-[90vh] max-w-2xl"
    >
      <SchoolHeader currentStep={currentStep} handleClose={handleClose} />

      <StepIndicator currentStep={currentStep} />

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
    </AnimatedModalShell>
  );
};

export default SchoolCreateModal;
