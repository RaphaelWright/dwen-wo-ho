"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
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

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <>
          <motion.div
            key="photo-cropper-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-3xl"
            onClick={onClose}
          />

          <motion.div
            key="photo-cropper-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border shadow-2xl">
              {/* Header */}
              <div className="border-b border-border bg-muted/30 px-8 py-6">
                <h2 className="text-xl font-bold text-foreground">
                  {SIGN_UP_TEXTS.photoStep.editPhoto}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {SIGN_UP_TEXTS.photoStep.editPhotoDescription}
                </p>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-6 p-8">
                <div className="relative h-96 w-full overflow-hidden bg-muted">
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

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-muted-foreground"
                    aria-label="Zoom"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    aria-label="Reset crop"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-8 py-6">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="border-destructive px-6 text-destructive hover:border-destructive hover:bg-destructive hover:text-white"
                  disabled={isSaving}
                >
                  {SIGN_UP_TEXTS.photoStep.cancel}
                </Button>
                <LoadingButton
                  type="button"
                  onClick={onSave}
                  loading={isSaving}
                  loadingText={SIGN_UP_TEXTS.photoStep.uploading}
                  className="bg-primary px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none"
                >
                  {SIGN_UP_TEXTS.photoStep.add}
                </LoadingButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
