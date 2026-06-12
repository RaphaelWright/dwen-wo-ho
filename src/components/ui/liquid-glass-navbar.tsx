"use client";

import { type Ref, useState, type CSSProperties, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";
import { m } from "motion/react";
import LiquidGlass from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

/** A single tab item in the navbar. */
export interface GlassNavTab {
  /** Unique identifier for this tab */
  id: string;
  /** Display label shown below the icon */
  label: string;
  /** Icon element (e.g. a Lucide icon) */
  icon: ReactNode;
  /** Badge count — shows a red dot if > 0 */
  badge?: number | null;
  /** Render as a small avatar circle instead of the raw icon */
  isAvatar?: boolean;
  /** Custom avatar content (emoji, image, etc.) — used when isAvatar is true */
  avatarContent?: ReactNode;
  /** If set, clicking this tab fires onAction instead of switching active state */
  onAction?: () => void;
}

export interface LiquidGlassNavbarProps {
  /** Tab definitions */
  tabs: GlassNavTab[];
  /** Currently active tab id (controlled mode) */
  activeTab?: string;
  /** Default active tab id (uncontrolled mode) */
  defaultActiveTab?: string;
  /** Callback when a tab is clicked */
  onTabChange?: (tabId: string) => void;
  /** Extra className on the outer wrapper */
  className?: string;
  /** Extra inline styles on the outer wrapper */
  style?: CSSProperties;
  /** Whether to show tab labels below icons (default true) */
  showLabels?: boolean;
  /** Unique layoutId prefix for the hover pill animation.
   *  Use this when rendering multiple navbars on the same page. */
  layoutId?: string;

  /* ── LiquidGlass props (with navbar-tuned defaults) ──────── */

  /** Corner radius of the glass wrapper (default 999 = pill) */
  cornerRadius?: number;
  /** Backdrop blur in px (default 16) */
  blur?: number;
  /** Backdrop saturation in % (default 160) */
  saturation?: number;
  /** SVG displacement scale for refraction (default 6) */
  displacementScale?: number;
  /** Background tint color (default "rgba(255,255,255,0.1)") */
  tint?: string;
  /** Padding inside the glass wrapper (default "0px 6px") */
  padding?: string;
  /** Whether to show the gloss edge border (default true) */
  showBorder?: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   TabItem (internal)
   ═══════════════════════════════════════════════════════════════ */

interface TabItemInternalProps {
  tab: GlassNavTab;
  isActive: boolean;
  isHovered: boolean;
  onActivate: () => void;
  onHover: () => void;
  showLabels: boolean;
  layoutId: string;
  isDark: boolean;
}

// Booleans here (active / hovered / showLabels / isDark) are independent UI
// states that can be true in any combination, so they are intentionally kept as
// separate flags rather than collapsed into a single variant union.
function TabItem({
  tab,
  isActive,
  isHovered,
  onActivate,
  onHover,
  showLabels,
  layoutId,
  isDark,
}: TabItemInternalProps) {
  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onHover}
      className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent outline-none select-none"
    >
      {/* ── Active pill — glass backdrop ── */}
      {isActive && (
        <span
          className={cn(
            "absolute inset-0 z-0 w-full rounded-full saturate-[1.6] backdrop-blur-lg",
            isDark
              ? "bg-white/12 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.08)]"
              : "bg-black/8 shadow-[0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.06)]",
          )}
        />
      )}
      {/* ── Hover pill — slides between tabs with glass ── */}
      {isHovered && !isActive && (
        <m.div
          layoutId={layoutId}
          className="absolute z-0 h-full w-full overflow-hidden rounded-lg"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          <span
            className={cn(
              "absolute inset-0 rounded-full saturate-[1.4] backdrop-blur-md",
              isDark
                ? "bg-white/8 shadow-[0_0_0_0.5px_rgba(255,255,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-0.5px_1px_rgba(0,0,0,0.03)]"
                : "bg-black/5 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-0.5px_1px_rgba(0,0,0,0.02)]",
            )}
          />
        </m.div>
      )}

      {/* Icon bubble container */}
      <div
        className={cn(
          "relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-250 ease-in-out",
        )}
      >
        {/* ── Badge ── */}
        {/* {tab.badge != null && tab.badge > 0 && (
          <div className="absolute top-0.5 right-0.5 min-w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center px-0.5 shadow-[0_0_0_2px_var(--card)] z-20">
            {tab.badge}
          </div>
        )} */}

        {/* ── Icon ── */}
        <div
          className={cn(
            "z-10 mt-0.5 flex size-6 items-center justify-center transition-colors duration-200",
            isActive ? "text-primary" : "text-foreground",
          )}
        >
          {tab.icon}
        </div>
      </div>

      {/* ── Label ── */}
      {showLabels && (
        <span
          className={cn(
            "z-50 mb-1 text-xs leading-none tracking-wide transition-colors duration-200",
            isActive ? "text-primary font-semibold" : "font-normal",
          )}
        >
          {tab.label}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LiquidGlassNavbar
   ═══════════════════════════════════════════════════════════════ */

const LiquidGlassNavbar = ({
  tabs,
  activeTab: controlledActive,
  defaultActiveTab,
  onTabChange,
  className,
  style,
  showLabels = true,
  layoutId = "glass-hover-pill",
  // LiquidGlass props with navbar-tuned defaults
  cornerRadius = 999,
  blur = 8,
  saturation = 160,
  displacementScale = 6,
  tint,
  padding = "0px 6px",
  showBorder = true,
  ref,
}: LiquidGlassNavbarProps & { ref?: Ref<HTMLDivElement> }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const mounted = useHydrated();

  // Support both controlled and uncontrolled modes
  const [internalActive, setInternalActive] = useState(
    defaultActiveTab ?? tabs[0]?.id ?? "",
  );
  const active = controlledActive ?? internalActive;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Theme-aware tint default
  const resolvedTint =
    tint ?? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)");

  if (!mounted) {
    return null;
  }

  const handleActivate = (tab: GlassNavTab) => {
    if (tab.onAction) {
      tab.onAction();
      return;
    }
    if (controlledActive === undefined) {
      setInternalActive(tab.id);
    }
    onTabChange?.(tab.id);
  };

  return (
    <LiquidGlass
      ref={ref}
      cornerRadius={cornerRadius}
      blur={blur}
      saturation={saturation}
      displacementScale={displacementScale}
      padding={padding}
      tint={resolvedTint}
      showBorder={showBorder}
      style={style}
      className={cn(
        "right-0 bottom-3 left-0 z-50 mx-auto w-full max-w-sm p-2 md:hidden",
        className,
      )}
    >
      <div
        onMouseLeave={() => setHoveredId(null)}
        className="flex h-full items-center gap-2 rounded-4xl"
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={active === tab.id}
            isHovered={hoveredId === tab.id}
            onActivate={() => handleActivate(tab)}
            onHover={() => setHoveredId(tab.id)}
            showLabels={showLabels}
            layoutId={layoutId}
            isDark={isDark}
          />
        ))}
      </div>
    </LiquidGlass>
  );
};

export default LiquidGlassNavbar;
