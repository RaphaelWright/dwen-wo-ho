import { getMetadata } from "@/lib/metadata";
import { ProviderNewPasswordScreen } from "@/components/provider/auth/new-password-screen";

export const metadata = getMetadata(
  "Reset Password",
  "Set a new password for your Dwen Wo Ho provider account.",
  "/provider/new-password",
);

export default function ProviderNewPasswordPage() {
  return <ProviderNewPasswordScreen />;
}
