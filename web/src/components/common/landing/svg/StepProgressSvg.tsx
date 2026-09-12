"use client";

import { motion } from "motion/react";

interface StepSvgProps {
  step: 1 | 2 | 3;
}

export default function StepProgressSvg({ step }: StepSvgProps) {
  if (step === 1) {
    return (
      <div className="relative w-full h-44 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
        <svg
          viewBox="0 0 280 140"
          className="w-full h-full max-w-[280px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Step 1 Capture Link Animation</title>
          {/* Link pill input */}
          <rect
            x="20"
            y="24"
            width="240"
            height="34"
            rx="17"
            className="fill-card stroke-border"
            strokeWidth="1.2"
          />
          <circle
            cx="38"
            cy="41"
            r="5"
            className="fill-primary/20 stroke-primary"
            strokeWidth="1.2"
          />
          <text x="52" y="45" className="fill-foreground font-mono text-[10px]">
            https://react.dev
          </text>
          <rect
            x="194"
            y="29"
            width="56"
            height="24"
            rx="12"
            className="fill-primary"
          />
          <text
            x="222"
            y="45"
            textAnchor="middle"
            className="fill-primary-foreground font-sans text-[10px] font-semibold"
          >
            Save
          </text>

          {/* Animated beam flowing down */}
          <line
            x1="140"
            y1="62"
            x2="140"
            y2="88"
            className="stroke-border"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <motion.circle
            cx="140"
            cy="62"
            r="3"
            className="fill-mint"
            animate={{ cy: [62, 88, 62] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Parsed card */}
          <rect
            x="40"
            y="90"
            width="200"
            height="36"
            rx="8"
            className="fill-card stroke-border"
            strokeWidth="1.2"
          />
          <circle
            cx="58"
            cy="108"
            r="7"
            className="fill-mint/20 stroke-mint"
            strokeWidth="1"
          />
          <text
            x="72"
            y="105"
            className="fill-foreground font-sans text-[10px] font-bold"
          >
            React Documentation
          </text>
          <text
            x="72"
            y="117"
            className="fill-muted-foreground font-mono text-[8px]"
          >
            react.dev • Auto-saved
          </text>
        </svg>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="relative w-full h-44 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
        <svg
          viewBox="0 0 280 140"
          className="w-full h-full max-w-[280px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Step 2 Organize Into Collections</title>
          {/* Card falling into organized folder */}
          <g transform="translate(30, 20)">
            <rect
              x="0"
              y="0"
              width="100"
              height="42"
              rx="6"
              className="fill-card stroke-border"
              strokeWidth="1.2"
            />
            <text
              x="10"
              y="18"
              className="fill-foreground font-sans text-[9px] font-semibold"
            >
              CSS Grid Guide
            </text>
            <text
              x="10"
              y="30"
              className="fill-muted-foreground font-mono text-[8px]"
            >
              css-tricks.com
            </text>
          </g>

          <g transform="translate(150, 20)">
            <rect
              x="0"
              y="0"
              width="100"
              height="42"
              rx="6"
              className="fill-card stroke-border"
              strokeWidth="1.2"
            />
            <text
              x="10"
              y="18"
              className="fill-foreground font-sans text-[9px] font-semibold"
            >
              Postgres Tips
            </text>
            <text
              x="10"
              y="30"
              className="fill-muted-foreground font-mono text-[8px]"
            >
              pgmustard.com
            </text>
          </g>

          {/* Categorized collection bins without emojis */}
          <g transform="translate(30, 80)">
            <rect
              x="0"
              y="0"
              width="100"
              height="42"
              rx="8"
              className="fill-primary/10 stroke-primary/40"
              strokeWidth="1.2"
            />
            {/* Palette icon glyph */}
            <circle
              cx="16"
              cy="18"
              r="4"
              className="stroke-primary"
              strokeWidth="1.2"
            />
            <text
              x="26"
              y="21"
              className="fill-primary font-sans text-[10px] font-bold"
            >
              Design
            </text>
            <text
              x="12"
              y="34"
              className="fill-muted-foreground font-mono text-[8px]"
            >
              24 links saved
            </text>
          </g>

          <g transform="translate(150, 80)">
            <rect
              x="0"
              y="0"
              width="100"
              height="42"
              rx="8"
              className="fill-mint/10 stroke-mint/40"
              strokeWidth="1.2"
            />
            {/* Code icon glyph */}
            <path
              d="M12 18l3-3-3-3m8 6l-3-3 3-3"
              className="stroke-mint"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="28"
              y="21"
              className="fill-mint font-sans text-[10px] font-bold"
            >
              Development
            </text>
            <text
              x="12"
              y="34"
              className="fill-muted-foreground font-mono text-[8px]"
            >
              58 links saved
            </text>
          </g>

          {/* Animated flow connectors */}
          <motion.path
            d="M80 64L80 78"
            className="stroke-primary"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M200 64L200 78"
            className="stroke-mint"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <svg
        viewBox="0 0 280 140"
        className="w-full h-full max-w-[280px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Step 3 Sub-millisecond Search</title>
        {/* Search bar with ⌘K badge */}
        <rect
          x="20"
          y="20"
          width="240"
          height="34"
          rx="8"
          className="fill-card stroke-border"
          strokeWidth="1.2"
        />
        <circle
          cx="36"
          cy="37"
          r="5"
          className="stroke-primary"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="41"
          x2="44"
          y2="45"
          className="stroke-primary"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text
          x="52"
          y="41"
          className="fill-foreground font-sans text-[10px] font-medium"
        >
          prisma queries
        </text>

        <rect
          x="214"
          y="26"
          width="36"
          height="20"
          rx="4"
          className="fill-surface stroke-border"
          strokeWidth="1"
        />
        <text
          x="232"
          y="40"
          textAnchor="middle"
          className="fill-muted-foreground font-mono text-[8px] font-bold"
        >
          ⌘K
        </text>

        {/* Immediate Result Card */}
        <g transform="translate(20, 68)">
          <rect
            x="0"
            y="0"
            width="240"
            height="48"
            rx="8"
            className="fill-primary/10 stroke-primary/50"
            strokeWidth="1.2"
          />
          <circle
            cx="16"
            cy="24"
            r="6"
            className="fill-primary text-primary-foreground"
          />
          <text
            x="30"
            y="20"
            className="fill-foreground font-sans text-[10px] font-bold"
          >
            Prisma Reference
          </text>
          <text
            x="30"
            y="34"
            className="fill-muted-foreground font-mono text-[8px]"
          >
            prisma.io/docs • Instant match
          </text>
          <rect
            x="194"
            y="14"
            width="38"
            height="20"
            rx="4"
            className="fill-mint/20"
          />
          <text
            x="213"
            y="27"
            textAnchor="middle"
            className="fill-mint font-mono text-[8px] font-bold"
          >
            FOUND
          </text>
        </g>
      </svg>
    </div>
  );
}
