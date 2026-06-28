"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { ROUTES } from "@/lib/constants/infra/routes";

export const useAccountRecovery = (
  email: string,
  onForgotPassword?: () => void,
) => {
  const router = useRouter();
  const { recoverAccountMutation } = useAuthQuery();

  const handleRecoverAccount = async () => {
    try {
      await recoverAccountMutation.mutateAsync({ email });
      if (onForgotPassword) {
        onForgotPassword();
      } else {
        router.push(
          `${ROUTES.provider.resetPassword}&email=${encodeURIComponent(email)}`,
        );
      }
    } catch (error: unknown) {
      toast.error(getCleanErrorMessage(error));
    }
  };

  return {
    handleRecoverAccount,
    isRecovering: recoverAccountMutation.isPending,
  };
};
