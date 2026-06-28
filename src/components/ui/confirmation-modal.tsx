"use client";

import { ConfirmationModalProps } from "@/lib/types/components/shared/confirmation-modal";
import { Spinner } from "@/components/ui/spinner";

const variantStyles = {
  success: "bg-green-500 hover:bg-green-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  info: "bg-blue-500 hover:bg-blue-600 text-white",
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  loadingText = "Processing...",
}: ConfirmationModalProps) => {
  return (
    <div
      className={`bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-3 backdrop-blur-sm transition-all duration-300 ease-in-out sm:p-4 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`bg-card text-foreground border-border w-full max-w-sm rounded-xl border p-3 shadow-xl transition-all duration-300 ease-in-out sm:p-6 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-foreground mb-2 text-center text-base font-bold sm:mb-4 sm:text-xl">
          {title}
        </h2>
        <p className="text-muted-foreground mb-3 text-center text-xs sm:mb-6 sm:text-base">
          {message}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-base ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="text-current" />
                {loadingText}
              </span>
            ) : (
              confirmText
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-base"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
