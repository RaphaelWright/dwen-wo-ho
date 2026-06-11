import { getMetadata } from "@/lib/metadata";
import ProviderCheckEmailView from "./view";

export const metadata = getMetadata(
  "Check Your Email",
  "Confirm your email address to continue with Dwen Wo Ho.",
  "/provider/check-email",
);

export default function ProviderCheckEmailPage() {
  return <ProviderCheckEmailView />;
}
