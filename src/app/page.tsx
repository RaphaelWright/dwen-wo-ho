import JsonLd from "@/components/miscellaneous/json-ld";
import { JSON_LD_LANDING_2_PAGE } from "@/configs/json-ld";
import { getMetadata } from "@/lib/metadata";
import { LANDING_2_CONTENT } from "@/lib/marketing/landing-2";
import { Landing2 } from "@/components/marketing/landing-2";

export const metadata = getMetadata(
  LANDING_2_CONTENT.metadata.title,
  LANDING_2_CONTENT.metadata.description,
  "/landing-2",
);

export default function Landing2Page() {
  return (
    <>
      <JsonLd data={JSON_LD_LANDING_2_PAGE} />
      <Landing2 />
    </>
  );
}
