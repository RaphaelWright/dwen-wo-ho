export interface CheckEmailProps {
  onEmailSubmit: (email: string, emailExists: boolean) => void;
}

export interface UseProviderCheckEmailReturn {
  checkEmailExists: (email: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // Using any for now to avoid complex RHF types in return, or specific form type
}
