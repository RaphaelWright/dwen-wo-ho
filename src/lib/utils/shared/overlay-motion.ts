export const OVERLAY_EASE = [0.22, 1, 0.36, 1] as const;

export const OVERLAY_BACKDROP_TRANSITION = {
  duration: 0.5,
  ease: OVERLAY_EASE,
} as const;

export const OVERLAY_PANEL_TRANSITION = {
  duration: 0.58,
  ease: OVERLAY_EASE,
} as const;

export const OVERLAY_PANEL_INITIAL = { opacity: 0, y: 24 } as const;

export const OVERLAY_PANEL_ANIMATE = { opacity: 1, y: 0 } as const;

export const OVERLAY_PANEL_EXIT = { opacity: 0, y: 12 } as const;
