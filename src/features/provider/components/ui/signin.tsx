/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense } from "react";
import PendingVerificationModal from "@/components/modals/pending-verification";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { BaseSignInForm } from "@/features/auth/components/BaseSignInForm";
import { useProviderSignIn } from "@/features/auth/hooks/useProviderSignIn";

interface ProviderSignInProps {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}

const SignInContent = (props: ProviderSignInProps) => {
  const {
    register,
    onSubmit,
    errors,
    isLoading,
    isRecovering,
    handleRecoverAccount,
    errorMessage,
    showPendingModal,
    setShowPendingModal,
    userInfo,
  } = useProviderSignIn(props);

  return (
    <div className="min-h-screen h-full flex flex-col">
      <BaseSignInForm
        role="provider"
        email={props.email}
        register={register}
        errors={errors}
        onSubmit={onSubmit}
        onBack={props.onBack}
        onForgotPassword={props.onForgotPassword}
        onRecoverAccount={handleRecoverAccount}
        isLoading={isLoading}
        isRecovering={isRecovering}
        errorMessage={errorMessage}
      />

      <PendingVerificationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />

      <LoadingOverlay text="Signing in..." isVisible={isLoading} />
    </div>
  );
};

const ProviderSignIn = (props: ProviderSignInProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent {...props} />
    </Suspense>
  );
};

export default ProviderSignIn;


