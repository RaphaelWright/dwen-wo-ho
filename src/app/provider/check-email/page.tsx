"use client";

import CheckEmail from "@/features/provider/components/ui/check-email";
import { useProviderCheckEmailPage } from "@/hooks/provider/useProviderCheckEmailPage";

const ProviderCheckEmailPage = () => {
  const { handleEmailSubmit } = useProviderCheckEmailPage();

  return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
};

export default ProviderCheckEmailPage;
