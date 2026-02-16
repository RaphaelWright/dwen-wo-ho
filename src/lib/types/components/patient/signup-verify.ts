export interface VerifyFooterProps {
  onBack: () => void;
}

export interface VerifyOTPSectionProps {
  email: string;
  seconds: number;
  onComplete: (value: string) => void;
  onResend: () => void;
}
