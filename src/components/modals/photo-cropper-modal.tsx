"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperModalProps } from "@/lib/types/modals";
import { usePhotoCropperModal } from "@/hooks/components/modals/use-photo-cropper-modal";

export const PhotoCropperModal = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  onSave,
  onCancel,
  isSaving = false,
}: PhotoCropperModalProps) => {
  const { crop, setCrop, zoom, setZoom, handleReset } = usePhotoCropperModal();

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white shadow-2xl p-8 px-0 max-w-2xl w-full">
          <div className="space-y-6">
            <div className="text-left px-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {SIGN_UP_TEXTS.photoStep.editPhoto}
              </h3>
              <p className="text-gray-500 text-md font-bold">
                {SIGN_UP_TEXTS.photoStep.editPhotoDescription}
              </p>
            </div>

            {/* Photo Cropper */}
            <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-4 px-35">
              <div className="flex-1">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#955aa4]"
                />
              </div>

              <button
                onClick={handleReset}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                type="button"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end px-7 gap-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="px-8 py-1 rounded-full border-4 border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4] hover:text-white uppercase font-bold"
                disabled={isSaving}
              >
                {SIGN_UP_TEXTS.photoStep.cancel}
              </Button>
              <Button
                onClick={onSave}
                className="px-8 py-1 border-4 border-[#955aa4] rounded-full bg-[#955aa4]/60 hover:bg-[#955aa4]/90 text-white disabled:opacity-50 uppercase font-bold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {SIGN_UP_TEXTS.photoStep.uploading}
                  </>
                ) : (
                  SIGN_UP_TEXTS.photoStep.add
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
