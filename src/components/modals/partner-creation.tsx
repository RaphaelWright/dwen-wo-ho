"use client";

import { AnimatePresence, m } from "motion/react";
import { X, Upload, Building2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { PartnerCreationModalProps } from "@/lib/types/modals";
import { usePartnerCreation } from "@/hooks/components/modals/use-partner-creation";

const PartnerCreationModal = ({
  isOpen,
  onClose,
  onPartnerCreated,
}: PartnerCreationModalProps) => {
  const {
    name,
    setName,
    nickname,
    setNickname,
    slogan,
    setSlogan,
    logo,
    fileInputRef,
    createPartnerMutation,
    handlePickLogo,
    handleFileChange,
    handleSubmit,
  } = usePartnerCreation({ onPartnerCreated, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-3xl"
            onClick={onClose}
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground border-border mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
              {/* Header */}
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-8 py-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-foreground text-xl font-bold">
                      New Partner
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Add a new partner organization
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-8">
                <form
                  id="partner-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-name"
                      className="text-foreground text-sm font-semibold"
                    >
                      Partner Name
                    </label>
                    <div className="relative">
                      <input
                        id="partner-name"
                        aria-label="Partner name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
                        placeholder="e.g. Ministry of Health"
                      />
                      <Building2 className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-nickname"
                      className="text-foreground text-sm font-semibold"
                    >
                      Nickname (Optional)
                    </label>
                    <input
                      id="partner-nickname"
                      aria-label="Nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                      placeholder="e.g. MoH"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="partner-slogan"
                      className="text-foreground text-sm font-semibold"
                    >
                      Slogan
                    </label>
                    <input
                      id="partner-slogan"
                      aria-label="Slogan"
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                      placeholder="e.g. The Sound Of Young America"
                    />
                  </div>

                  {/* Logo */}
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-logo"
                      className="text-foreground text-sm font-semibold"
                    >
                      Partner Logo
                    </label>
                    <input
                      id="partner-logo"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      aria-label="Upload logo"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handlePickLogo}
                      className="bg-muted border-border hover:bg-muted/80 hover:border-primary/30 group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all"
                    >
                      {logo ? (
                        <div className="relative h-full w-full p-4">
                          <Image
                            src={logo}
                            alt="Logo preview"
                            width={128}
                            height={128}
                            className="h-full w-full object-contain"
                          />
                          <div className="bg-foreground/0 group-hover:bg-foreground/10 absolute inset-0 flex items-center justify-center transition-colors">
                            <span className="bg-background/90 rounded-full px-3 py-1 text-xs font-medium opacity-0 shadow-sm group-hover:opacity-100">
                              Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110">
                            <Upload className="text-primary h-5 w-5" />
                          </div>
                          <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
                            Click to upload logo
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="border-border bg-muted/30 flex justify-end gap-3 border-t px-8 py-6">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  className="px-6"
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  form="partner-form"
                  loading={createPartnerMutation.isPending}
                  loadingText="Creating..."
                  disabled={!name.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:opacity-50 disabled:shadow-none"
                >
                  Create Partner
                </LoadingButton>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PartnerCreationModal;
