import { getMetadata } from "@/lib/metadata";
import ProviderPasswordSetupView from "./view";

export const metadata = getMetadata(
  "Set Password",
  "Create a secure password for your Dwen Wo Ho provider account.",
  "/provider/signup",
);

export default function ProviderPasswordSetupPage() {
  return <ProviderPasswordSetupView />;
}
