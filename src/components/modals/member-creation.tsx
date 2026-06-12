"use client";

import { m, AnimatePresence } from "motion/react";
import { CheckCircle2Icon, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { MemberCreationModalProps } from "@/lib/types/modals";
import { useMemberCreation } from "@/hooks/components/modals/use-member-creation";

const MemberCreationModal = ({
  isOpen,
  onClose,
  onMemberCreated,
}: MemberCreationModalProps) => {
  const {
    formData,
    isSubmitted,
    isSubmitting,
    memberTitles,
    handleInputChange,
    handleSubmit,
  } = useMemberCreation({ onMemberCreated, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-3xl"
            onClick={onClose}
          />

          {/* Modal */}
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
                      New Member
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Add a team member to your organization
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
                  id="member-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Title Selection */}
                  <div className="space-y-3">
                    <span className="text-foreground block text-sm font-semibold">
                      Role / Title
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {memberTitles.map((title) => (
                        <button
                          key={title}
                          type="button"
                          onClick={() => handleInputChange("title", title)}
                          className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-sm font-medium transition-all duration-200 ${
                            formData.title === title
                              ? "bg-primary text-primary-foreground shadow-primary/20 ring-primary shadow-md ring-2 ring-offset-2"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:border-border border border-transparent"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="member-name"
                      className="text-foreground text-sm font-semibold"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="member-name"
                        type="text"
                        aria-label="Full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
                        placeholder="Enter member's full name"
                      />
                      <UserPlus className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <m.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-success/10 border-success/20 text-success flex items-center gap-3 rounded-xl border p-4">
                          <CheckCircle2Icon className="h-5 w-5 shrink-0" />
                          <p className="text-sm font-medium">
                            <span className="font-bold">
                              {formData.title} {formData.name}
                            </span>{" "}
                            has been added successfully!
                          </p>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
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
                  form="member-form"
                  loading={isSubmitting}
                  loadingText="Adding..."
                  disabled={
                    !formData.title || !formData.name.trim() || isSubmitted
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitted ? "Added" : "Add Member"}
                </LoadingButton>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberCreationModal;
