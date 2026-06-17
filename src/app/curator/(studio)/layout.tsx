import type { ReactNode } from "react";

import { CuratorAuthGate } from "@/components/curator/layout/curator-auth-gate";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <CuratorAuthGate>
      <div className="h-screen w-full overflow-hidden">{children}</div>
    </CuratorAuthGate>
  );
}
