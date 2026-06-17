"use client";

import CheckEmail from "@/components/provider/auth/check-email/index";
import { useProviderCheckEmailPage } from "@/hooks/provider/check-email-page/use-check-email-page";

const ProviderCheckEmailPage = () => {
  const { handleEmailSubmit } = useProviderCheckEmailPage();

  return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
};

export default ProviderCheckEmailPage;
