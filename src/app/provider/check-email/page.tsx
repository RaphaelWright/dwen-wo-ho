"use client";

import CheckEmail from "@/components/provider/auth/check-email";
import { useProviderCheckEmailPage } from "@/hooks/provider/use-provider-check-email-page";

const ProviderCheckEmailPage = () => {
  const { handleEmailSubmit } = useProviderCheckEmailPage();

  return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
};

export default ProviderCheckEmailPage;
