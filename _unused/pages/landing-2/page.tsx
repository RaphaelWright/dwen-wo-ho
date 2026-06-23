import JsonLd from "@/components/miscellaneous/json-ld";
import { LockIn2 } from "@/unused/components/marketing/lock-in-2";
import { JSON_LD_LOCK_IN_2_PAGE } from "@/configs/json-ld";
import { getMetadata } from "@/lib/metadata";
import { LOCK_IN_2_CONTENT } from "@/_unused/lib/marketing/landing-2";

export const metadata = getMetadata(
  LOCK_IN_2_CONTENT.metadata.title,
  LOCK_IN_2_CONTENT.metadata.description,
  "/lock-in-2",
);

export default function LockIn2Page() {
  return (
    <>
      <JsonLd data={JSON_LD_LOCK_IN_2_PAGE} />
      <LockIn2 />
    </>
  );
}
