"use client";

export const useProfessionalTitle = ({
  onSelect,
  onClose,
}: {
  onSelect: (title: string) => void;
  onClose: () => void;
}) => {
  const handleTitleSelect = (title: string) => {
    onSelect(title);
    onClose();
  };

  return {
    handleTitleSelect,
  };
};
