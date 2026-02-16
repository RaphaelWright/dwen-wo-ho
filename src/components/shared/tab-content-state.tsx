import { LucideIcon } from "lucide-react";

interface TabContentStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  EmptyIcon?: LucideIcon;
  children: React.ReactNode;
}

export const TabContentState = ({
  isLoading,
  isEmpty,
  loadingMessage = "Loading...",
  emptyMessage = "No data available",
  EmptyIcon,
  children,
}: TabContentStateProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        {EmptyIcon && (
          <EmptyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        )}
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
