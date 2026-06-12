import { ReactNode } from "react";

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-3 text-[10.5px] font-bold tracking-[.08em] uppercase ${className}`}
      style={{ color: "#555e72" }}
    >
      {children}
    </p>
  );
}

export function InfoCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-2.5 rounded-xl border p-3.5">
      <p className="text-muted-foreground mb-1 text-[10.5px]">{label}</p>
      <p className="text-muted-foreground text-[14px]">{children}</p>
    </div>
  );
}
