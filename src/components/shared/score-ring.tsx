"use client";
import { getScoreColor } from "@/lib/utils/new-provider";
import { useTheme } from "next-themes";
import { ClientOnly } from "../ui/client-only";

export default function ScoreRing({ score }: { score: number | string }) {
  let cleanedScore = typeof score === "string" ? parseInt(score) : score;
  const color = getScoreColor(cleanedScore);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  // Logic to prevent "blank" look:
  // If score is 0, we show 2% of the ring as a "sliver"
  const visualScore = cleanedScore === 0 ? 0.2 : (cleanedScore ?? 0);
  const dash = (visualScore / 10) * circumference;
  const { theme } = useTheme();
  return (
    <ClientOnly>
      <svg
        viewBox="0 0 48 48"
        width={48}
        height={48}
        className="shrink-0"
        aria-label={`Risk score: ${score}`}
      >
        {/* Background Track: Stays constant for all levels */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={
            theme === "light" ? "var(--muted-foreground)" : "var(--foreground)"
          } // Ensure this is a light gray in your CSS
          strokeWidth="4"
          opacity="0.2"
        />
        {/* Active Fill: Changes color and length based on score */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4} // Starts at the top (12 o'clock)
          strokeLinecap="round"
          className="transition-all duration-700 ease-in-out"
          transform="rotate(-90 24 24)" // Rotates to ensure it fills clockwise from top
        />
        {/* Label: Color-matched to the ring status */}
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="800"
          fill={color}
        >
          {cleanedScore != null ? cleanedScore.toFixed(2) : "–"}
        </text>
      </svg>
    </ClientOnly>
  );
}
