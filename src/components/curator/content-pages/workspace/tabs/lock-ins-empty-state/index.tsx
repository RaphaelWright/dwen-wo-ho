"use client";

export function LockInsEmptyState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-foreground mb-2 text-xl font-semibold">
          No lock-ins available
        </p>
        <p className="text-muted-foreground">
          Lock-ins are not available at the moment.
        </p>
      </div>
    </div>
  );
}
