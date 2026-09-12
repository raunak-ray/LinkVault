"use client";

import { motion } from "motion/react";

export default function SearchCommandSvg() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <svg
        viewBox="0 0 360 180"
        className="w-full h-full max-w-[360px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Command Search Animation</title>
        {/* Search Modal Box */}
        <rect
          x="10"
          y="12"
          width="340"
          height="156"
          rx="12"
          className="fill-card stroke-border shadow-sm"
          strokeWidth="1.2"
        />

        {/* Search Input Bar */}
        <g transform="translate(22, 24)">
          {/* Search Icon */}
          <circle
            cx="10"
            cy="10"
            r="6"
            className="stroke-muted-foreground"
            strokeWidth="1.6"
          />
          <line
            x1="14"
            y1="14"
            x2="19"
            y2="19"
            className="stroke-muted-foreground"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Query Text */}
          <text
            x="28"
            y="14"
            className="fill-foreground font-sans text-[12px] font-medium"
          >
            design system tokens
          </text>

          {/* Blinking Cursor */}
          <motion.line
            x1="162"
            y1="4"
            x2="162"
            y2="17"
            className="stroke-primary"
            strokeWidth="1.8"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />

          {/* Shortcut Keys */}
          <g transform="translate(262, 2)">
            <rect
              x="0"
              y="0"
              width="22"
              height="18"
              rx="4"
              className="fill-surface stroke-border"
              strokeWidth="1"
            />
            <text
              x="11"
              y="13"
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[9px] font-semibold"
            >
              ⌘
            </text>
            <rect
              x="26"
              y="0"
              width="22"
              height="18"
              rx="4"
              className="fill-surface stroke-border"
              strokeWidth="1"
            />
            <text
              x="37"
              y="13"
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[9px] font-semibold"
            >
              K
            </text>
          </g>

          {/* Divider */}
          <line
            x1="0"
            y1="28"
            x2="316"
            y2="28"
            className="stroke-border/70"
            strokeWidth="1"
          />
        </g>

        {/* Search Results list */}
        <g transform="translate(22, 64)">
          {/* Active Result item */}
          <rect
            x="0"
            y="0"
            width="316"
            height="42"
            rx="8"
            className="fill-primary/10 stroke-primary/30"
            strokeWidth="1"
          />
          <circle
            cx="18"
            cy="21"
            r="5"
            className="fill-primary/20 stroke-primary"
            strokeWidth="1.2"
          />
          <text
            x="32"
            y="18"
            className="fill-foreground font-sans text-[11px] font-semibold"
          >
            Tailwind CSS v4 Token Architecture
          </text>
          <text
            x="32"
            y="32"
            className="fill-muted-foreground font-mono text-[9px]"
          >
            tailwindcss.com/docs/theme
          </text>
          {/* Latency badge */}
          <rect
            x="256"
            y="12"
            width="48"
            height="18"
            rx="4"
            className="fill-mint/20"
          />
          <text
            x="280"
            y="24"
            textAnchor="middle"
            className="fill-mint font-mono text-[9px] font-bold"
          >
            4ms
          </text>
        </g>

        <g transform="translate(22, 114)">
          {/* Second Result item */}
          <rect
            x="0"
            y="0"
            width="316"
            height="40"
            rx="8"
            className="fill-surface/40 stroke-border/40"
            strokeWidth="1"
          />
          <circle
            cx="18"
            cy="20"
            r="5"
            className="fill-muted-foreground/20 stroke-muted-foreground"
            strokeWidth="1"
          />
          <text
            x="32"
            y="18"
            className="fill-foreground/80 font-sans text-[11px] font-medium"
          >
            Radix UI Design Tokens & Stitches
          </text>
          <text
            x="32"
            y="31"
            className="fill-muted-foreground/70 font-mono text-[9px]"
          >
            radix-ui.com/primitives
          </text>
        </g>
      </svg>
    </div>
  );
}
