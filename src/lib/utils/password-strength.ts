import {
  PasswordRequirements,
  PasswordStrengthLabel,
  PasswordStrengthResult,
  PasswordStrengthTone,
} from "@/lib/types/auth/password-strength";

const PASSWORD_REQUIREMENT_CHECKS: Record<
  keyof PasswordRequirements,
  RegExp
> = {
  length: /.{6,}/,
  lowercase: /(?=.*[a-z])/,
  uppercase: /(?=.*[A-Z])/,
  number: /(?=.*\d)/,
  special: /(?=.*[@$!%*?&])/,
};

const getStrengthLabel = (score: number): PasswordStrengthLabel => {
  if (score <= 20) return "Weak";
  if (score <= 60) return "Moderate";
  if (score < 100) return "Strong";
  return "VeryStrong";
};

const getStrengthTone = (score: number): PasswordStrengthTone => {
  if (score <= 20) return "destructive";
  if (score <= 60) return "warning";
  if (score < 100) return "successLight";
  return "success";
};

export const evaluatePasswordRequirements = (
  password: string
): PasswordRequirements => ({
  length: PASSWORD_REQUIREMENT_CHECKS.length.test(password),
  lowercase: PASSWORD_REQUIREMENT_CHECKS.lowercase.test(password),
  uppercase: PASSWORD_REQUIREMENT_CHECKS.uppercase.test(password),
  number: PASSWORD_REQUIREMENT_CHECKS.number.test(password),
  special: PASSWORD_REQUIREMENT_CHECKS.special.test(password),
});

export const evaluatePasswordStrength = (
  password: string
): PasswordStrengthResult => {
  const requirements = evaluatePasswordRequirements(password);
  const score =
    Object.values(requirements).filter(Boolean).length * 20;

  return {
    score,
    label: getStrengthLabel(score),
    tone: getStrengthTone(score),
    requirements,
  };
};
