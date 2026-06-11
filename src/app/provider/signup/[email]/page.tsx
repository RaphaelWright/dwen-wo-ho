import { getMetadata } from "@/lib/metadata";
import ProviderSignUpVerifyView from "./view";

export const metadata = getMetadata(
  "Verify Email",
  "Verify your email address to complete your Dwen Wo Ho sign up.",
  "/provider/signup",
);

export default function ProviderSignUpVerifyPage() {
  return <ProviderSignUpVerifyView />;
}
