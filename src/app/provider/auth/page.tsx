import { getMetadata } from "@/lib/metadata";
import ProviderAuthView from "./view";

export const metadata = getMetadata(
  "Provider Sign In",
  "Sign in to your Dwen Wo Ho provider account.",
  "/provider/auth",
);

export default function ProviderAuthPage() {
  return <ProviderAuthView />;
}
