import * as React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  /** When omitted with size="icon", shows spinner only while loading */
  loadingText?: React.ReactNode;
};

function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  size,
  className,
  ...props
}: LoadingButtonProps) {
  const showSpinnerOnly =
    loading && loadingText === undefined && (size === "icon" || !children);

  return (
    <Button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      size={size}
      className={cn(className)}
      {...props}
    >
      {loading ? (
        showSpinnerOnly ? (
          <Spinner />
        ) : (
          <>
            <Spinner />
            {loadingText ?? children}
          </>
        )
      ) : (
        children
      )}
    </Button>
  );
}

export { LoadingButton };
