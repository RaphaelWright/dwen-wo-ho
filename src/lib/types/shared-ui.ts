import { PARTNER_SCHOOLS } from "@/lib/constants/components/social-proof";

export interface LogoProps {
  variant?: "black" | "purple";
  className?: string;
  withLink?: boolean;
}

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export interface FormSelectProps extends React.ComponentProps<"select"> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

export interface MarqueeRowProps {
  items: typeof PARTNER_SCHOOLS;
  direction?: "left" | "right";
  speed?: number;
}
