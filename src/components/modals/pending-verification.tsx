"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { FiLogOut } from "react-icons/fi";
import { PendingVerificationModalProps } from "@/lib/types/modals";
import { DEFAULT_PENDING_USER_INFO } from "@/lib/constants/mock-data";
import { usePendingVerification } from "@/hooks/components/modals/use-pending-verification";

const PendingVerificationModal = ({
  isOpen,
  isLoading = false,
  userInfo = DEFAULT_PENDING_USER_INFO,
}: PendingVerificationModalProps) => {
  const { showLogoutModal, setShowLogoutModal, handleLogout } =
    usePendingVerification();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-card rounded-3xl shadow-2xl max-w-2xl w-full border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-card px-6 py-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <Logo />
              </div>
              {!isLoading && (
                <span className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">
                  Verification Pending
                </span>
              )}

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-full hover:bg-destructive/10"
                title="Log Out"
              >
                <span className="font-medium text-sm">Log out</span>
                <FiLogOut size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {isLoading ? (
                // Loading Skeleton State
                <div className="animate-pulse space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="shrink-0">
                      <div className="w-32 h-32 bg-muted rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-8 bg-muted rounded w-3/4"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-muted rounded-xl w-full"></div>
                </div>
              ) : (
                // Loaded State
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Profile Image */}
                    <div className="shrink-0">
                      {userInfo.profileImage ? (
                        <Image
                          width={128}
                          height={128}
                          src={userInfo.profileImage}
                          alt={userInfo.name}
                          className="w-32 h-32 rounded-full object-cover ring-4 ring-background shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-4xl font-bold shadow-inner ring-4 ring-background">
                          {userInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      {userInfo.timeAgo && (
                        <p className="text-sm font-medium text-muted-foreground">
                          Joined {userInfo.timeAgo}
                        </p>
                      )}
                      <h2 className="text-2xl font-bold text-foreground">
                        {userInfo.name}
                      </h2>
                      <p className="text-lg text-muted-foreground font-medium">
                        {userInfo.title}
                      </p>

                      <div className="pt-4 flex items-center justify-center sm:justify-start gap-3">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </div>
                        <span className="text-amber-600 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-sm">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-muted/30 p-6 rounded-2xl border border-border text-center">
                    <p className="text-muted-foreground leading-relaxed">
                      You can call the JustGo Health verification team on{" "}
                      <span className="text-foreground font-semibold">
                        0538920991
                      </span>
                      <br />
                      or email them at{" "}
                      <span className="text-foreground font-semibold">
                        prince.baadu7@gmail.com
                      </span>{" "}
                      to speed up the process.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          handleLogout();
          setShowLogoutModal(false);
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        variant="danger"
      />
    </AnimatePresence>
  );
};

export default PendingVerificationModal;
