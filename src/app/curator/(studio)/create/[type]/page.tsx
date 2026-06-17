import { Suspense } from "react";
import { CreativeStudiosFlowView } from "./view";

export default async function CreativeStudiosTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  return (
    <Suspense fallback={null}>
      <CreativeStudiosFlowView typeParam={type} />
    </Suspense>
  );
}
