import { getMetadata } from "@/lib/metadata";
import { ProviderSignupScreen } from "@/components/provider/auth/signup-screen";

export const metadata = getMetadata(
  "Provider Sign Up",
  "Create your Dwen Wo Ho provider account.",
  "/provider/signup",
);

export default function ProviderSignUpPage() {
  return <ProviderSignupScreen />;
}
