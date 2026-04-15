"use client";
import { motion, AnimatePresence } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-3xl z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh] border border-border">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SchoolCreationModal;
