import { useMemo } from "react";

/** Animated ember particles + grid + drifting glows. Pure CSS, GPU friendly. */
export function AnimatedBackground() {
  const embers = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        duration: 9 + Math.random() * 12,
        delay: Math.random() * 12,
        drift: `${(Math.random() - 0.5) * 120}px`,
        crimson: Math.random() > 0.45,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,oklch(0.3_0.09_25/35%),transparent_45%),radial-gradient(circle_at_85%_80%,oklch(0.32_0.09_150/40%),transparent_50%)]" />
      {/* grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      {/* drifting glow blobs */}
      <div className="animate-float absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div
        className="animate-float absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-forest/25 blur-[130px]"
        style={{ animationDelay: "2s" }}
      />
      {/* embers */}
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-[-10px] rounded-full"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            // @ts-expect-error custom prop for keyframe
            "--drift": e.drift,
            background: e.crimson ? "var(--crimson)" : "var(--ember)",
            boxShadow: e.crimson
              ? "0 0 8px 1px var(--crimson-glow)"
              : "0 0 8px 1px oklch(0.78 0.18 55 / 60%)",
            animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
