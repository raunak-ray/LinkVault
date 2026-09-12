"use client";

import { motion } from "motion/react";

export default function SecurityLockSvg() {
  return (
    <div className="relative w-full h-52 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full max-w-[200px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Vault Security Lock Animation</title>
        {/* Concentric rotating vault rings */}
        <motion.circle
          cx="100"
          cy="80"
          r="64"
          className="stroke-border"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ originX: "100px", originY: "80px" }}
        />

        <motion.circle
          cx="100"
          cy="80"
          r="48"
          className="stroke-primary/30"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ originX: "100px", originY: "80px" }}
        />

        {/* Central Vault Shield */}
        <circle
          cx="100"
          cy="80"
          r="32"
          className="fill-card stroke-primary"
          strokeWidth="1.6"
        />

        {/* Padlock Icon */}
        <g transform="translate(88, 66)">
          {/* Shackle */}
          <path
            d="M6 10V6a6 6 0 0 1 12 0v4"
            className="stroke-primary"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Body */}
          <rect
            x="2"
            y="10"
            width="20"
            height="16"
            rx="4"
            className="fill-primary text-primary-foreground"
          />
          {/* Keyhole */}
          <circle cx="12" cy="17" r="1.5" className="fill-card" />
          <line
            x1="12"
            y1="18.5"
            x2="12"
            y2="22"
            className="stroke-card"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Status text */}
        <text
          x="100"
          y="152"
          textAnchor="middle"
          className="fill-mint font-mono text-[10px] font-semibold tracking-wider"
        >
          ENCRYPTED VAULT
        </text>
      </svg>
    </div>
  );
}
