"use client";

import { CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import { PhotoStepProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperModal } from "@/components/modals/photo-cropper-modal";
import { usePhotoStep } from "@/hooks/components/provider/auth/signup/use-photo-step";
import { Input } from "@/components/ui/input";
import { activateOnKeyboard } from "@/lib/utils/a11y";

const PhotoStep = ({
  profilePhoto,
  onChange,
}: PhotoStepProps) => {
  const {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    addPhotoMutation,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  } = usePhotoStep({ onChange });

  return (
    <>
      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Photo Upload Section */}
        <div className="space-y-8 text-center">
          {/* Text Section */}
          <div className="space-y-4">
            {profilePhoto ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    {SIGN_UP_TEXTS.photoStep.photoAdded}
                  </h1>
                  <CheckCircle2 className="w-8 h-8 text-primary animate-in zoom-in spin-in-90 duration-300" />
                </div>
                <p className="text-muted-foreground text-lg">
                  {SIGN_UP_TEXTS.photoStep.photoAddedDescription}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {SIGN_UP_TEXTS.photoStep.addPhoto}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {SIGN_UP_TEXTS.photoStep.photoDescription}
                </p>
              </>
            )}
          </div>

          {/* Photo Circle */}
          <div className="flex justify-center py-4">
            {profilePhoto ? (
              <div
                role="button"
                tabIndex={0}
                aria-label="Change profile photo"
                onClick={handleFileClick}
                onKeyDown={activateOnKeyboard(handleFileClick)}
                className="cursor-pointer group relative"
              >
                <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-background ring-4 ring-muted shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:ring-primary/50">
                  <Image
                    width={208}
                    height={208}
                    src={profilePhoto}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white font-medium">Change Photo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload profile photo"
                onClick={handleUploadClick}
                onKeyDown={activateOnKeyboard(handleUploadClick)}
                className="w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all duration-300 bg-muted/10 group"
              >
                <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-muted-foreground font-medium group-hover:text-primary transition-colors">
                  {SIGN_UP_TEXTS.photoStep.addPhoto}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <PhotoCropperModal
        isOpen={isPhotoModalOpen}
        imageSrc={imageSrc}
        onClose={() => setIsPhotoModalOpen(false)}
        onCropComplete={onCropComplete}
        onSave={handleAddPhoto}
        onCancel={handleCancel}
        isSaving={addPhotoMutation.isPending}
      />
    </>
  );
};

export default PhotoStep;
