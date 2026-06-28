import { getMetadata } from "@/lib/metadata";
import { ProviderAuthWorkspace } from "@/components/provider/auth/auth-workspace";

export const metadata = getMetadata(
  "Provider Sign In",
  "Sign in to your Dwen Wo Ho provider account.",
  "/provider/auth",
);

export default function ProviderAuthPage() {
  return <ProviderAuthWorkspace />;
}
