export interface LogoProps {
  className?: string;
  variant?: "default" | "white" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
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


