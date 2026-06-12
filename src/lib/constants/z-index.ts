/** Layering: sticky page chrome < header < modals/overlays */
export const Z_INDEX_CLASSES = {
  stickyChrome: "z-40",
  header: "z-50",
  modal: "z-[60]",
} as const;
