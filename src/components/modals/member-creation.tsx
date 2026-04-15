"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2Icon, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    memberTitles,
    handleInputChange,
    handleSubmit,
  } = useMemberCreation({ onMemberCreated, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
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
                      New Member
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add a team member to your organization
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
                  id="member-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Title Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Role / Title
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {memberTitles.map((title) => (
                        <button
                          key={title}
                          type="button"
                          onClick={() => handleInputChange("title", title)}
                          className={`py-3 px-2 rounded-xl font-medium text-sm transition-all duration-200 flex flex-col items-center gap-2 ${
                            formData.title === title
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-border"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Enter member's full name"
                      />
                      <UserPlus className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl text-success">
                          <CheckCircle2Icon className="w-5 h-5 shrink-0" />
                          <p className="font-medium text-sm">
                            <span className="font-bold">
                              {formData.title} {formData.name}
                            </span>{" "}
                            has been added successfully!
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  form="member-form"
                  disabled={
                    !formData.title || !formData.name.trim() || isSubmitted
                  }
                  className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitted ? "Added" : "Add Member"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberCreationModal;
