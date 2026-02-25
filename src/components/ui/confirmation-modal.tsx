"use client";

import { ConfirmationModalProps } from "@/lib/types/shared-ui";

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
}: ConfirmationModalProps) => {
  const variantStyles = {
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm bg-background/80 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-card text-foreground rounded-xl border border-border p-4 sm:p-6 max-w-sm w-full shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-foreground">
          {title}
        </h2>
        <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 sm:py-2 text-center font-medium rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
