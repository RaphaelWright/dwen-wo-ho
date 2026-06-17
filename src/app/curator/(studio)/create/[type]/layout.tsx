import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CreativeStudiosWizardShell } from "@/components/curator/create/creative-studios/wizard-shell";
import { isCreativeStudiosType } from "@/lib/utils/curator/create/is-creative-studios-type";

export default async function CreativeStudiosWizardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!isCreativeStudiosType(type)) {
    notFound();
  }

  return (
    <CreativeStudiosWizardShell type={type}>
      {children}
    </CreativeStudiosWizardShell>
  );
}
