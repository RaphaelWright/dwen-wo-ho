import JsonLd from "@/components/miscellaneous/json-ld";
import { ProviderLaunch2 } from "@/components/marketing/provider-launch-2";
import { JSON_LD_FOR_PROVIDERS_PAGE } from "@/configs/json-ld";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "For Providers",
  "Explore the provider launch narrative for JustGo Health and see how the platform supports care for Gen Z students.",
  "/join-as-provider-2",
);

export default function JoinAsProvider2Page() {
  return (
    <>
      <JsonLd data={JSON_LD_FOR_PROVIDERS_PAGE} />
      <ProviderLaunch2 />
    </>
  );
}
