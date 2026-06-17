import WidthConstraint from "@/components/ui/width-constraint";
import { LEGAL_POLICY_LAST_UPDATED } from "@/lib/constants/legal";
import type { LegalPolicyPageShellProps } from "@/lib/types/components/legal/policy-page";

export function LegalPolicyPageShell({
  title,
  children,
}: LegalPolicyPageShellProps) {
  return (
    <div className="bg-background text-foreground py-20">
      <WidthConstraint>
        <h1 className="mb-8 text-4xl font-bold">{title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {LEGAL_POLICY_LAST_UPDATED}</p>
          {children}
        </div>
      </WidthConstraint>
    </div>
  );
}
