import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolEditFooterProps } from "@/lib/types/components/modals/school-edit";

export const SchoolEditFooter = ({
  handleDisable,
  isPending,
  hasChanges,
}: SchoolEditFooterProps) => {
  return (
    <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <Button
        type="button"
        onClick={handleDisable}
        variant="ghost"
        className="px-6 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
      >
        <Ban className="w-4 h-4" />
        Disable School
      </Button>
      <Button
        type="submit"
        form="school-edit-form"
        disabled={isPending || !hasChanges}
        className="px-8 bg-[#955aa4] hover:bg-[#8a4d99] text-white font-semibold shadow-lg shadow-[#955aa4]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Update School"}
      </Button>
    </div>
  );
};
