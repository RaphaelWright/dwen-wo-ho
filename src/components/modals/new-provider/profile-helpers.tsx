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
      className={`text-[10.5px] font-bold tracking-[.08em] uppercase mb-3 ${className}`}
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
    <div className="p-3.5 rounded-xl border mb-2.5">
      <p className="text-[10.5px] mb-1 text-muted-foreground">{label}</p>
      <p className="text-[14px] text-muted-foreground">{children}</p>
    </div>
  );
}
