import type { ReactNode } from "react";
import { ProviderAuthShell } from "@/components/provider/auth/auth-shell";

export default function ProviderAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProviderAuthShell>{children}</ProviderAuthShell>;
}
