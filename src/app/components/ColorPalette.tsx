"use client";

import { useState } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
    } catch {
      setCopied(null);
    }
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {colors.map((hex) => {
        const isCopied = copied === hex;

        return (
          <li key={hex}>
            <button
              type="button"
              onClick={() => copyColor(hex)}
              aria-label={`${hex} in die Zwischenablage kopieren`}
              className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-left transition hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span
                className="block h-16 w-full"
                style={{ backgroundColor: hex }}
                aria-hidden
              />
              <span className="block px-3 py-2">
                <span className="block font-mono text-sm text-white">{hex}</span>
                <span className="block text-xs text-slate-400">
                  {isCopied ? "Kopiert" : "Kopieren"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
