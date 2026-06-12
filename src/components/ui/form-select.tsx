import * as React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  ref?: React.Ref<React.ComponentRef<typeof SelectTrigger>>;
}

const FormSelect = ({
  value,
  onValueChange,
  placeholder,
  className,
  children,
  defaultOpen,
  open,
  onOpenChange,
  ref,
  ...props
}: FormSelectProps) => {
  const baseStyles =
    "w-full rounded-xl border  p-2 sm:p-3 !h-12 sm:!h-14 hover:bg-muted transition-colors";

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger ref={ref} className={cn(baseStyles, className)} {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full rounded-xl border p-0 shadow-lg">
        {children}
      </SelectContent>
    </Select>
  );
};

export { FormSelect };
