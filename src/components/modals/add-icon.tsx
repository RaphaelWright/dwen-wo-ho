"use client";

import Image from "next/image";
import { AddIconModalProps } from "@/lib/types/modals";
import { Lock, X } from "lucide-react";
import { useIconForm } from "@/hooks/components/modals/use-icon-form";
import { Button } from "../ui/button";

export default function AddIconModal({
  isOpen,
  onClose,
  onComplete,
  editData = null,
  selectedSchool,
}: AddIconModalProps) {
  const {
    photoPreview,
    name,
    setName,
    slogan,
    setSlogan,
    rank,
    setRank,
    lockIns,
    newLockInInput,
    setNewLockInInput,
    fileInputRef,
    handleAddLockIn,
    handleUpdateLockIn,
    handleRemoveLockIn,
    handlePhotoSelect,
    handleSubmit,
    firstCampus,
    headerTitle,
    isSubmitDisabled,
  } = useIconForm({ editData, onComplete, isOpen, selectedSchool });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border-2 border-[#955aa4]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Button
            onClick={onClose}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Image
              src="/arrow-diagonal-white.svg"
              alt="Back"
              width={20}
              height={20}
              className="rotate-180"
            />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{headerTitle}</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-6 h-full">
            {/* Left Side - Preview */}
            <div className="flex flex-col space-y-4 flex-1 h-full">
              <div className="relative w-full flex-1 min-h-100 rounded-xl overflow-hidden bg-gray-100">
                {photoPreview ? (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 z-0"
                    >
                      <Image
                        src={photoPreview}
                        alt={name || "Icon preview"}
                        fill
                        className="object-cover"
                      />
                    </Button>
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                      <span className="text-black font-bold text-lg">
                        #{rank}
                      </span>
                    </div>
                    {/* Name Overlay */}
                    {name && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/70 to-transparent z-10">
                        <p className="text-white text-3xl font-bold">{name}</p>
                        {slogan && (
                          <p className="text-white/90 text-lg mt-1">{slogan}</p>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Image
                        src="/logos/logo-purple.png"
                        alt="Add icon"
                        width={24}
                        height={24}
                        className="w-10 h-10 object-contain item-center justify-center"
                      />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* School Info */}
              {selectedSchool && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  {selectedSchool.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={selectedSchool.logo}
                        alt={selectedSchool.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-xl">🏫</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {selectedSchool.name}
                    </p>
                    {firstCampus && (
                      <p className="text-sm text-gray-500">{firstCampus}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Lock-ins Section */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Lock-ins ({lockIns.length})
                </h3>
                {lockIns.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {lockIns.map((lockIn, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2"
                      >
                        <input
                          type="text"
                          value={lockIn}
                          onChange={(e) =>
                            handleUpdateLockIn(index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                        />
                        <Button
                          onClick={() => handleRemoveLockIn(index)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
                {/* Add Lock-in Input */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newLockInInput}
                    onChange={(e) => setNewLockInInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddLockIn();
                      }
                    }}
                    placeholder="Enter lock-in..."
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] placeholder-gray-400"
                  />
                  <Button
                    onClick={handleAddLockIn}
                    disabled={!newLockInInput.trim()}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                      !newLockInInput.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="hidden lg:block w-px bg-gray-200 shrink-0"></div>

            {/* Right Side - Form */}
            <div className="flex-1 space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Slogan Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Slogan
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Enter slogan..."
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Photo Button */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Photo
                </label>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-gray-900"
                >
                  + Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              {/* Rank Control */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Rank
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setRank(Math.max(1, rank - 1))}
                    className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold text-gray-900 min-w-12 text-center">
                    {rank}
                  </span>
                  <Button
                    onClick={() => setRank(rank + 1)}
                    className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isSubmitDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            GO
          </Button>
        </div>
      </div>
    </div>
  );
}
