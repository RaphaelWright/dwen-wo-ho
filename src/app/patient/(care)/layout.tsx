import { ReactNode } from "react";

export default function PatientCareLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="bg-background min-h-[100dvh] w-full overflow-y-auto">
      {children}
    </main>
  );
}
