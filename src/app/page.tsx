"use client";

import { FormEvent, useState } from "react";
import ColorPalette from "./components/ColorPalette";

type AnalysisResult = {
  url: string;
  palette: string[];
  recommendations: string[];
};

const PALETTES: string[][] = [
  ["#38BDF8", "#818CF8", "#0F172A", "#F8FAFC", "#34D399"],
  ["#F472B6", "#FB7185", "#1E1B4B", "#FAF5FF", "#FBBF24"],
  ["#2DD4BF", "#22D3EE", "#042F2E", "#F0FDFA", "#A3E635"],
];

function paletteForUrl(url: string): string[] {
  const sum = [...url].reduce((total, char) => total + char.charCodeAt(0), 0);
  return PALETTES[sum % PALETTES.length];
}

function recommendationsFor(url: string): string[] {
  let host = url.trim();
  try {
    host = new URL(url.includes("://") ? url : `https://${url}`).hostname;
  } catch {
    host = url.trim();
  }

  return [
    `Typografie: Auf ${host} größere Überschriften und eine klarere Schrift-Hierarchie einsetzen, damit der erste Blick die Kernaussage trifft.`,
    "Abstände: Sektionen mit mehr Weißraum trennen und Inhalte in schmale, gut lesbare Spalten legen.",
    "Kontrast: Die Primärfarbe nur für Buttons und Links nutzen, Flächen und Fließtext in ruhigen Neutraltönen halten.",
  ];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("Bitte eine Website-URL eingeben.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResult({
      url: trimmed,
      palette: paletteForUrl(trimmed),
      recommendations: recommendationsFor(trimmed),
    });
    setLoading(false);
  }

  return (
    <div className="flex flex-1 bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-wide text-sky-400">
            Redesign-Tool
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Website analysieren
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-400">
            URL eingeben, kurz analysieren lassen und eine Farbpalette plus
            drei konkrete Redesign-Empfehlungen erhalten.
          </p>
        </header>

        <form
          onSubmit={handleAnalyze}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/30 sm:flex-row sm:items-center"
        >
          <label className="sr-only" htmlFor="website-url">
            Website-URL
          </label>
          <input
            id="website-url"
            type="text"
            inputMode="url"
            placeholder="https://beispiel.de"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 shrink-0 rounded-xl bg-sky-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Analysiere…" : "Analysieren"}
          </button>
        </form>

        {error ? (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-slate-300"
            role="status"
            aria-live="polite"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
            Farbpalette und Empfehlungen werden vorbereitet…
          </div>
        ) : null}

        {result ? (
          <section className="flex flex-col gap-8" aria-live="polite">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Farbpalette
                </h2>
                <p className="mt-1 text-sm text-slate-400">{result.url}</p>
              </div>
              <ColorPalette colors={result.palette} />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-white">
                Redesign-Empfehlungen
              </h2>
              <ol className="flex flex-col gap-3">
                {result.recommendations.map((recommendation, index) => (
                  <li
                    key={recommendation}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-sm text-sky-300">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-slate-200">
                      {recommendation}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
