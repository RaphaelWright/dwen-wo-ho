export interface VerifyPasswordResetFooterProps {
  onBack: () => void;
}

export interface VerifyPasswordResetOTPSectionProps {
  email: string;
  seconds: number;
  onComplete: (value: string) => void;
  onResend: () => void;
}
