"use client";

import { motion } from "motion/react";

export default function LinkEnrichmentSvg() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <svg
        viewBox="0 0 420 180"
        className="w-full h-full max-w-[420px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Link Enrichment Animation</title>
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--mint)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Browser / Input Bar */}
        <rect
          x="20"
          y="12"
          width="380"
          height="34"
          rx="8"
          className="fill-card stroke-border"
          strokeWidth="1.2"
        />

        {/* Input protocol badge */}
        <rect
          x="28"
          y="18"
          width="48"
          height="22"
          rx="4"
          className="fill-primary/15"
        />
        <text
          x="52"
          y="33"
          textAnchor="middle"
          className="fill-primary font-mono text-[10px] font-medium"
        >
          HTTPS
        </text>

        {/* URL text */}
        <text x="86" y="33" className="fill-foreground font-mono text-[11px]">
          github.com/shadcn/ui
        </text>

        {/* Parsing badge */}
        <rect
          x="320"
          y="18"
          width="70"
          height="22"
          rx="4"
          className="fill-mint/15"
        />
        <circle cx="330" cy="29" r="3" className="fill-mint" />
        <text
          x="362"
          y="33"
          textAnchor="middle"
          className="fill-mint font-sans text-[10px] font-semibold"
        >
          PARSED
        </text>

        {/* Connector line with moving data beam */}
        <line
          x1="210"
          y1="46"
          x2="210"
          y2="66"
          className="stroke-border"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        <motion.circle
          cx="210"
          cy="46"
          r="3"
          className="fill-primary"
          animate={{ cy: [46, 66, 46], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Output Enriched Card */}
        <g transform="translate(30, 68)">
          <rect
            x="0"
            y="0"
            width="360"
            height="96"
            rx="12"
            className="fill-card stroke-border shadow-sm"
            strokeWidth="1.2"
          />

          {/* Favicon box */}
          <rect
            x="14"
            y="14"
            width="30"
            height="30"
            rx="8"
            className="fill-primary/10 stroke-primary/30"
            strokeWidth="1"
          />
          <path
            d="M24 30L29 22L34 30"
            className="stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Title and metadata */}
          <text
            x="54"
            y="26"
            className="fill-foreground font-sans text-[12px] font-bold"
          >
            shadcn/ui — Accessible UI Components
          </text>
          <text
            x="54"
            y="41"
            className="fill-muted-foreground font-sans text-[10px]"
          >
            Beautifully designed components built with Tailwind & Base UI.
          </text>

          {/* Tags & speed chip */}
          <rect
            x="54"
            y="54"
            width="60"
            height="18"
            rx="4"
            className="fill-surface stroke-border"
            strokeWidth="1"
          />
          <text
            x="84"
            y="67"
            textAnchor="middle"
            className="fill-muted-foreground font-mono text-[9px]"
          >
            #frontend
          </text>

          <rect
            x="120"
            y="54"
            width="54"
            height="18"
            rx="4"
            className="fill-surface stroke-border"
            strokeWidth="1"
          />
          <text
            x="147"
            y="67"
            textAnchor="middle"
            className="fill-muted-foreground font-mono text-[9px]"
          >
            #react
          </text>

          {/* Extraction latency indicator */}
          <g transform="translate(270, 54)">
            <rect
              x="0"
              y="0"
              width="74"
              height="18"
              rx="9"
              className="fill-mint/15"
            />
            <circle cx="10" cy="9" r="2.5" className="fill-mint" />
            <text
              x="42"
              y="12"
              textAnchor="middle"
              className="fill-mint font-mono text-[9px] font-semibold"
            >
              120ms
            </text>
          </g>

          {/* Ambient micro scan line */}
          <motion.rect
            x="0"
            y="94"
            width="360"
            height="2"
            fill="url(#beamGrad)"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      </svg>
    </div>
  );
}
