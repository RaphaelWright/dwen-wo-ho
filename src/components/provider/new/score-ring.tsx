import { getScoreColor } from "@/lib/utils/new-provider";

/**
 * Animated SVG donut ring displaying a 0-100 risk score.
 * @param {{ score: number, status: string }} props
 */
export default function ScoreRing({
  score,
  status,
}: {
  score: number;
  status: string;
}) {
  const color = getScoreColor(status);
  const radius = 18;
  const circumference = 2 * Math.PI * radius; // ≈ 113.1
  const dash = (score / 10) * circumference;

  return (
    <svg
      viewBox="0 0 48 48"
      width={48}
      height={48}
      className="shrink-0"
      aria-label={`Risk score: ${score}`}
    >
      {/* Track */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="4"
      />
      {/* Fill */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset="22"
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      {/* Label */}
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fontWeight="800"
        className="fill-foreground"
      >
        {score.toFixed(1)}
      </text>
    </svg>
  );
}
