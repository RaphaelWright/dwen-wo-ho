import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function WidthConstraint(props: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={cn("max-w-7xl mx-auto w-full h-full p-4", props.className)}>
      {props.children}
    </div>
  );
}
