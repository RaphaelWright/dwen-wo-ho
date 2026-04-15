"use client";

import Image from "next/image";
import { AddIconModalProps } from "@/lib/types/modals";
import { ArrowBigLeftIcon, Lock, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background backdrop-blur-sm">
      <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Button
            onClick={onClose}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/40 transition-colors"
          >
           <ArrowBigLeftIcon/>
          </Button>
          <h2 className="text-2xl font-bold text-foreground">{headerTitle}</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Side - Preview */}
            <div className="flex flex-col space-y-4 flex-1 h-full">
              <div className="relative w-full flex-1 min-h-100 rounded-xl overflow-hidden bg-muted/30 border border-border">
                {photoPreview ? (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 z-0 p-0 h-full w-full bg-transparent hover:bg-foreground/10 transition-colors"
                    >
                      <Image
                        src={photoPreview}
                        alt={name || "Icon preview"}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </Button>
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-card border-2 border-foreground flex items-center justify-center z-10 shadow-lg">
                      <span className="text-foreground font-bold text-lg">
                        #{rank}
                      </span>
                    </div>
                    {/* Name Overlay */}
                    {name && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-foreground/80 to-transparent z-10">
                        <p className="text-background text-3xl font-bold drop-shadow-md">
                          {name}
                        </p>
                        {slogan && (
                          <p className="text-background/90 text-lg mt-1 drop-shadow-sm">
                            {slogan}
                          </p>
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
                      className="text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-transparent h-auto flex flex-col gap-2"
                    >
                      <Image
                        src="/logos/logo-purple.png"
                        alt="Add icon"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain opacity-50"
                      />
                      <span className="text-sm font-medium">
                        Click to upload photo
                      </span>
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
                <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-xl">
                  {selectedSchool.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image
                        src={selectedSchool.logo}
                        alt={selectedSchool.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                      <span className="text-xl">🏫</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {selectedSchool.name}
                    </p>
                    {firstCampus && (
                      <p className="text-sm text-muted-foreground">
                        {firstCampus}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Lock-ins Section */}
              <div className="p-4 bg-muted/10 rounded-xl border border-border">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-warning" />
                  Lock-ins ({lockIns.length})
                </h3>
                {lockIns.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
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
                          className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <Button
                          onClick={() => handleRemoveLockIn(index)}
                          className="p-2 h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors bg-transparent text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
                  />
                  <Button
                    onClick={handleAddLockIn}
                    disabled={!newLockInInput.trim()}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                      !newLockInInput.trim()
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="hidden lg:block w-px bg-border shrink-0"></div>

            {/* Right Side - Form */}
            <div className="flex-1 space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Slogan Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Slogan
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Enter slogan..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Photo Button */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Photo
                </label>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg font-semibold hover:bg-muted transition-colors text-foreground h-auto justify-start"
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
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Rank
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setRank(Math.max(1, rank - 1))}
                    className="w-10 h-10 bg-muted/50 border border-border rounded-lg flex items-center justify-center font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold text-foreground min-w-12 text-center">
                    {rank}
                  </span>
                  <Button
                    onClick={() => setRank(rank + 1)}
                    className="w-10 h-10 bg-muted/50 border border-border rounded-lg flex items-center justify-center font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-border bg-muted/20">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors h-auto ${
              isSubmitDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            }`}
          >
            GO
          </Button>
        </div>
      </div>
    </div>
  );
}
