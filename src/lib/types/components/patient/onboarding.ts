export interface VerifyFooterProps {
  onBack: () => void;
}

export interface VerifyOTPSectionProps {
  email: string;
  seconds: number;
  onComplete: (value: string) => void;
  onResend: () => void;
}

export interface VerifyPasswordResetFooterProps {
  onBack: () => void;
}

export interface VerifyPasswordResetOTPSectionProps {
  email: string;
  seconds: number;
  onComplete: (value: string) => void;
  onResend: () => void;
}

export interface WaitingRoomFooterProps {
  onBack: () => void;
}

export interface WaitingRoomStatusCardProps {
  elapsedTime: number;
  formattedTime: string;
}
