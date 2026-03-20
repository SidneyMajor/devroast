import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ScoreRingProps = ComponentProps<"div"> & {
  score: number;
  total?: number;
  size?: number;
};

function scoreGradientId(score: number) {
  return `score-gradient-${score.toString().replace(".", "-")}`;
}

function lerpChannel(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function lerpHex(start: string, end: string, t: number) {
  const s = start.replace("#", "");
  const e = end.replace("#", "");
  const [ar, ag, ab] = [s.slice(0, 2), s.slice(2, 4), s.slice(4, 6)].map((x) => parseInt(x, 16));
  const [br, bg, bb] = [e.slice(0, 2), e.slice(2, 4), e.slice(4, 6)].map((x) => parseInt(x, 16));
  const r = lerpChannel(ar, br, t).toString(16).padStart(2, "0");
  const g = lerpChannel(ag, bg, t).toString(16).padStart(2, "0");
  const b = lerpChannel(ab, bb, t).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

const STOP_RED = "#EF4444";
const STOP_AMBER = "#F59E0B";
const STOP_GREEN = "#10B981";
const T1 = 1 / 3; // ~0.333
const T2 = 2 / 3; // ~0.667

function lerp3(stop1: string, stop2: string, stop3: string, t: number) {
  if (t <= 0.5) {
    return lerpHex(stop1, stop2, t * 2);
  }
  return lerpHex(stop2, stop3, (t - 0.5) * 2);
}

function getScoreColor(score: number, total: number) {
  const clamp = Math.max(0, Math.min(score / total, 1));
  if (clamp <= T1) {
    // Red -> Amber
    return lerpHex(STOP_RED, STOP_AMBER, clamp / T1);
  }
  if (clamp <= T2) {
    // Amber -> Green across middle band
    return lerpHex(STOP_AMBER, STOP_GREEN, (clamp - T1) / (T2 - T1));
  }
  // High scores stay green
  return STOP_GREEN;
}

const DEFAULT_SIZE = 180;

function ScoreRing({ score, total = 10, size = DEFAULT_SIZE, className, ...props }: ScoreRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(score / total, 1);
  const filled = circumference * ratio;
  const gap = circumference - filled;
  const gradientId = scoreGradientId(score);
  const scoreColor = getScoreColor(score, total);

  return (
    <div
      className={twMerge(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-label={`Score: ${score} out of ${total}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={STOP_RED} />
            <stop offset="33.3%" stopColor={STOP_AMBER} />
            <stop offset="66.6%" stopColor={STOP_GREEN} />
            <stop offset="100%" stopColor={scoreColor} />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth={strokeWidth}
        />

        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Center score */}
      <div className="flex items-end gap-0.5">
        <span
          className="font-mono text-[48px] font-bold leading-none"
          style={{ color: scoreColor }}
        >
          {score % 1 === 0 ? score.toFixed(1) : score.toString()}
        </span>
        <span className="font-mono text-base text-[#6B7280] leading-none mb-1">
          /{total}
        </span>
      </div>
    </div>
  );
}

export { ScoreRing, type ScoreRingProps };
