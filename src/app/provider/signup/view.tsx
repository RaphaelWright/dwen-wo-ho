"use client";

import Layout from "@/app/provider/auth/layout";
import ProviderSignUp from "@/components/provider/auth/sign-up";
import { Suspense } from "react";
import { useProviderSignup } from "@/hooks/provider/use-provider-signup";

const SignUpPageContent = () => {
  const {
    email,
    fullName,
    title,
    specialty,
    profileImage,
    profileStep,
    isResumeLocked,
    isCheckingGuard,
    handleBack,
  } = useProviderSignup();

  return (
    <ProviderSignUp
      email={email}
      fullName={fullName}
      title={title}
      specialty={specialty}
      profileImage={profileImage}
      profileStep={profileStep}
      isResumeLocked={isResumeLocked}
      isCheckingGuard={isCheckingGuard}
      onBack={handleBack}
    />
  );
};

const SignUpPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpPageContent />
      </Suspense>
    </Layout>
  );
};

export default SignUpPage;
