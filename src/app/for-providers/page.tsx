import ProvidersHero from "@/components/hero/providers";
import JsonLd from "@/components/json-ld";
import { JSON_LD_FOR_PROVIDERS_PAGE } from "@/lib/constants/json-ld";

export default function ProvidersPage() {
  return (
    <main className="">
      <JsonLd data={JSON_LD_FOR_PROVIDERS_PAGE} />
      <ProvidersHero />
    </main>
  );
}
