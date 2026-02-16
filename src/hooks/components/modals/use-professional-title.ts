"use client";

interface UseProfessionalTitleProps {
  onSelect: (title: string) => void;
  onClose: () => void;
}

export const useProfessionalTitle = ({
  onSelect,
  onClose,
}: UseProfessionalTitleProps) => {
  const handleTitleSelect = (title: string) => {
    onSelect(title);
    onClose();
  };

  return {
    handleTitleSelect,
  };
};
