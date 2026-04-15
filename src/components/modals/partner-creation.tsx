"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Upload, Building2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-background/80 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden flex flex-col border border-border">
              {/* Header */}
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      New Partner
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add a new partner organization
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
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
                    <label className="text-sm font-semibold text-foreground">
                      Partner Name
                    </label>
                    <div className="relative">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. Ministry of Health"
                      />
                      <Building2 className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Nickname (Optional)
                    </label>
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. MoH"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Slogan
                    </label>
                    <input
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. The Sound Of Young America"
                    />
                  </div>

                  {/* Logo */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Partner Logo
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handlePickLogo}
                      className="w-full h-32 bg-muted border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 hover:border-primary/30 transition-all group overflow-hidden relative"
                    >
                      {logo ? (
                        <div className="relative w-full h-full p-4">
                          <Image
                            src={logo}
                            alt="Logo preview"
                            width={128}
                            height={128}
                            className="object-contain w-full h-full"
                          />
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-background/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-background rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            Click to upload logo
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-border bg-muted/30 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="partner-form"
                  disabled={!name.trim() || createPartnerMutation.isPending}
                  className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {createPartnerMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Partner"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PartnerCreationModal;
