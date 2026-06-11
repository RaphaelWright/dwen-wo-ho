"use client";

import {
  type CSSProperties,
  type Ref,
  useId,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";
import { activateOnKeyboard } from "@/lib/utils/a11y";

/* ── Generate a smooth radial displacement map on a canvas ────
   Center = rgb(128,128,0) → no displacement.
   Edges push outward: R encodes X offset, G encodes Y offset.
   This produces a perfectly uniform lens-refraction effect.     */
function generateDisplacementMap(size = 128): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  const center = size / 2;
  const maxR = center;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const norm = Math.min(dist / maxR, 1);

      // Smooth edge-only displacement (0 in center, peaks near edge)
      // Using a smooth cubic ease: stronger near edges, zero at center
      const strength = norm * norm * (3 - 2 * norm); // smoothstep

      // Direction from center outward
      const angle = Math.atan2(dy, dx);
      const offsetX = Math.cos(angle) * strength;
      const offsetY = Math.sin(angle) * strength;

      const idx = (y * size + x) * 4;
      data[idx] = Math.round(128 + offsetX * 127); // R → X displacement
      data[idx + 1] = Math.round(128 + offsetY * 127); // G → Y displacement
      data[idx + 2] = 128; // B (unused)
      data[idx + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/* ── GlassFilter ──────────────────────────────────────────────
   Inline SVG defining the displacement filter.
   Uses a dynamically generated displacement map for uniform
   edge refraction.                                             */
function GlassFilter({
  id,
  scale,
  mapUrl,
}: {
  id: string;
  scale: number;
  mapUrl: string;
}) {
  if (!mapUrl) return null;

  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <filter
          id={id}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={mapUrl}
            result="DISP"
            preserveAspectRatio="none"
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="DISP"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ── Props ────────────────────────────────────────────────────── */
export interface LiquidGlassProps {
  children?: ReactNode;
  /** Corner radius in px (default 24) */
  cornerRadius?: number;
  /** Backdrop blur in px (default 16) */
  blur?: number;
  /** Backdrop saturation in % (default 160) */
  saturation?: number;
  /** SVG displacement scale for the refraction (default 6) */
  displacementScale?: number;
  /** Extra className on the outer wrapper */
  className?: string;
  /** Extra inline styles on the outer wrapper */
  style?: CSSProperties;
  /** Padding for the content area (default "20px 24px") */
  padding?: string;
  /** Whether to show the gloss edge border (default true) */
  showBorder?: boolean;
  /** Background tint color (default "rgba(255,255,255,0.1)") */
  tint?: string;
  /** onClick handler */
  onClick?: () => void;
}

/* ── Shared displacement map cache ─────────────────────────── */
let cachedMapUrl: string | null = null;

/* ── Static style bases (hoisted to avoid recreating per render) ── */
const GLASS_BACKDROP_BASE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  width: "100%",
  height: "100%",
};

const GLASS_BORDER_BASE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 50,
  pointerEvents: "none",
  padding: "1.5px",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude" as CSSProperties["maskComposite"],
};

/* ── Component ───────────────────────────────────────────────── */
const LiquidGlass = ({
  children,
  cornerRadius = 24,
  blur = 2,
  saturation = 160,
  displacementScale = 6,
  className = "",
  style,
  padding = "20px 24px",
  showBorder = true,
  tint = "rgba(255,255,255,0.1)",
  onClick,
  ref,
}: LiquidGlassProps & { ref?: Ref<HTMLDivElement> }) => {
    const filterId = useId().replace(/:/g, "_"); // : is invalid in CSS url()
    const [mapUrl, setMapUrl] = useState(cachedMapUrl ?? "");

    useEffect(() => {
      if (!cachedMapUrl) {
        cachedMapUrl = generateDisplacementMap(128);
      }
      setMapUrl(cachedMapUrl);
    }, []);

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const borderGradient = showBorder
      ? isDark
        ? `linear-gradient(
            135deg,
            rgba(255,255,255,0.0) 0%,
            rgba(255,255,255,0.25) 33%,
            rgba(255,255,255,0.5) 66%,
            rgba(255,255,255,0.0) 100%
          )`
        : `linear-gradient(
            135deg,
            rgba(0,0,0,0.0) 0%,
            rgba(0,0,0,0.06) 33%,
            rgba(0,0,0,0.12) 66%,
            rgba(0,0,0,0.0) 100%
          )`
      : "none";

    return (
      <div
        ref={ref}
        onClick={onClick}
        onKeyDown={onClick ? activateOnKeyboard(onClick) : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={className}
        style={{
          position: "relative",
          borderRadius: cornerRadius,
          overflow: "hidden",
          cursor: onClick ? "pointer" : undefined,
          background: tint,
          ...style,
        }}
      >
        {/* Hidden SVG filter definition */}
        <GlassFilter id={filterId} scale={displacementScale} mapUrl={mapUrl} />

        {/* ── Backdrop layer ─────────────────────────────────
            This is the layer that gets blurred + displaced.
            It sits behind the content via z-index.            */}
        <span
          style={{
            ...GLASS_BACKDROP_BASE,
            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
            filter: `url(#${filterId})`,
            borderRadius: cornerRadius,
          }}
        />

        {/* ── Gloss border ───────────────────────────────────
            Thin edge highlight using mask-composite to cut out
            the interior — only the 1.5px border is visible.   */}
        {showBorder && (
          <span
            style={{
              ...GLASS_BORDER_BASE,
              borderRadius: cornerRadius,
              background: borderGradient,
              boxShadow: isDark
                ? "0 0 0 0.5px rgba(255,255,255,0.15) inset, " +
                  "0 1px 2px rgba(255,255,255,0.1) inset, " +
                  "0 1px 3px rgba(0,0,0,0.2)"
                : "0 0 0 0.5px rgba(0,0,0,0.08) inset, " +
                  "0 1px 2px rgba(255,255,255,0.5) inset, " +
                  "0 1px 3px rgba(0,0,0,0.08)",
            }}
          />
        )}

        {/* ── Outer shadow layer ─────────────────────────────
            A subtle drop-shadow on the glass panel itself.    */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            borderRadius: cornerRadius,
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)"
              : "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
            pointerEvents: "none",
          }}
        />

        {/* ── Content ────────────────────────────────────────
            Sharp, un-blurred children on top.                 */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding,
          }}
        >
          {children}
        </div>
      </div>
    );
};

export default LiquidGlass;
