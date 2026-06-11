import { getMetadata } from "@/lib/metadata";
import ProviderNewPasswordView from "./view";

export const metadata = getMetadata(
  "Reset Password",
  "Set a new password for your Dwen Wo Ho provider account.",
  "/provider/new-password",
);

export default function ProviderNewPasswordPage() {
  return <ProviderNewPasswordView />;
}
