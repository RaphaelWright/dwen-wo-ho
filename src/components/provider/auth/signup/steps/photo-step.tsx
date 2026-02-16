"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import { PhotoStepProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperModal } from "@/components/modals/photo-cropper-modal";
import { usePhotoStep } from "@/hooks/components/provider/auth/signup/use-photo-step";
import { Input } from "@/components/ui/input";

const PhotoStep = ({
  profilePhoto,
  onChange,
  onNext,
  onBack,
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
  } = usePhotoStep({ onChange, onNext });

  return (
    <>
      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Photo Upload Section */}
        <div className="space-y-6 text-center">
          {/* Photo Circle */}
          <div className="flex justify-center py-6 -mt-15">
            {profilePhoto ? (
              <div onClick={handleFileClick} className="cursor-pointer">
                <Image
                  width={200}
                  height={200}
                  src={profilePhoto}
                  alt="Profile preview"
                  className="w-52 h-52 rounded-full object-cover border-4 border-gray-300 mx-auto hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div
                onClick={handleUploadClick}
                className="w-52 h-52 rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center mb-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-gray-500 font-bold text-lg">
                  {SIGN_UP_TEXTS.photoStep.addPhoto}
                </span>
              </div>
            )}
          </div>

          {/* Text below circle */}
          {profilePhoto ? (
            <>
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-3xl font-extrabold text-black">
                  {SIGN_UP_TEXTS.photoStep.photoAdded}
                </h1>
                <CheckCircle2 size={32} className="text-green-600" />
              </div>

              <p className="text-gray-500 text-base">
                {SIGN_UP_TEXTS.photoStep.photoAddedDescription}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold text-black">
                {SIGN_UP_TEXTS.photoStep.addPhoto}
              </h1>

              <p className="text-gray-600 text-lg font-bold px-10">
                {SIGN_UP_TEXTS.photoStep.photoDescription}
              </p>
            </>
          )}
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-6 py-4 items-center justify-between space-y-4 sm:space-y-0 mt-8 fixed bottom-0 right-0 w-full lg:w-1/2 bg-white">
        <Button
          onClick={onBack}
          className="rounded-full mr-2 px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          {SIGN_UP_TEXTS.navigation.back}
        </Button>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="font-semibold text-black">
                {SIGN_UP_TEXTS.profile.steps.photo}
              </span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
              <span className="text-gray-400">
                {SIGN_UP_TEXTS.profile.steps.bio}
              </span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
              <span className="text-gray-400">
                {SIGN_UP_TEXTS.profile.steps.specialty}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!profilePhoto}
          className="rounded-full ml-2 px-8 py-1 border-4 text-lg font-bold uppercase transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#955aa4]/80 text-white border-[#955aa4] hover:bg-[#955aa4] disabled:hover:bg-[#955aa4]/80"
        >
          {SIGN_UP_TEXTS.navigation.next}
        </Button>
      </div>

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
