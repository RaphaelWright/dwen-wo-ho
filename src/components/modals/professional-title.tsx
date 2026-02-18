"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { ProfessionalTitleModalProps } from "@/lib/types/modals";
import { useProfessionalTitle } from "@/hooks/components/modals/use-professional-title";
import { PROFESSIONAL_TITLES } from "@/lib/constants/components/modals/professional-title";

const ProfessionalTitleModal: React.FC<ProfessionalTitleModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTitle,
}) => {
  const { handleTitleSelect } = useProfessionalTitle({ onSelect, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Professional Title
                </h2>
                <p className="text-gray-600 mt-1">
                  Select your professional title
                </p>
              </div>

              {/* Title List */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {PROFESSIONAL_TITLES.map((title) => (
                    <button
                      key={title.value}
                      onClick={() => handleTitleSelect(title.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTitle === title.value
                          ? "border-[#ed1c24] bg-red-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg font-medium text-gray-900">
                        {title.label}
                      </span>
                      {selectedTitle === title.value && (
                        <div className="w-6 h-6 bg-[#ed1c24] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfessionalTitleModal;
