import type { Metadata } from "next";
import { APP_NAME } from "@iwai/shared";

export const metadata: Metadata = {
  title: "IWAI — Event Memory & Photo Sharing",
};

export default function HomePage(): React.JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 px-4">
      {/* Hero */}
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo mark */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
          <span className="text-4xl font-bold text-white">I</span>
        </div>

        {/* Brand */}
        <h1 className="text-6xl font-bold tracking-tight text-white">{APP_NAME}</h1>

        <p className="max-w-md text-xl text-brand-200">
          Every guest&apos;s perspective. One shared gallery. No app install required.
        </p>

        {/* Status badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Infrastructure initialized — feature development starting soon
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-16 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {[
          { label: "Next.js 15", desc: "Web app" },
          { label: "Expo", desc: "Mobile app" },
          { label: "NestJS", desc: "API" },
          { label: "PostgreSQL", desc: "Database" },
        ].map(({ label, desc }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-brand-300">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
