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
}

const FormSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FormSelectProps
>(
  (
    {
      value,
      onValueChange,
      placeholder,
      className,
      children,
      defaultOpen,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
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
        <SelectTrigger
          ref={ref}
          className={cn(baseStyles, className)}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full border rounded-xl shadow-lg p-0">
          {children}
        </SelectContent>
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";

export { FormSelect };


