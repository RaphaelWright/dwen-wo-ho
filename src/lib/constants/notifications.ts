import { FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";

export const NOTIFICATION_TYPE_CONFIG = {
  success: {
    icon: FiCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  error: {
    icon: FiAlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  info: {
    icon: FiInfo,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
};
