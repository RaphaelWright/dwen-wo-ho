import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function WidthConstraint(props: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={cn("mx-auto h-full w-full max-w-7xl p-4", props.className)}>
      {props.children}
    </div>
  );
}
