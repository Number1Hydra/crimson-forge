import { useState } from "react";
import { toast } from "sonner";
import { Play, Loader2, Zap, Gauge, Boxes, Sparkles, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEWS, BUILT_IN_CLIENTS } from "./data";
import { useLauncher } from "./store";

const ACCENT: Record<string, string> = {
  crimson: "from-primary/25 to-transparent border-primary/40",
  forest: "from-forest/30 to-transparent border-forest/40",
  ember: "from-ember/25 to-transparent border-ember/40",
};

const STAGES = [
  "Authenticating session…",
  "Resolving version manifest…",
  "Downloading libraries…",
  "Injecting client mods…",
  "Building runtime…",
  "Launching Minecraft…",
];

export function HomeView({ onNavigate }: { onNavigate: (v: "versions" | "clients") => void }) {
  const { selectedVersion, selectedClient, account, mods } = useLauncher();
  const [launching, setLaunching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  const client = BUILT_IN_CLIENTS.find((c) => c.id === selectedClient);
  const enabledMods = mods.filter((m) => m.enabled).length;

  const launch = () => {
    if (launching) return;
    setLaunching(true);
    setProgress(0);
    let i = 0;
    setStage(STAGES[0]);
    const interval = setInterval(() => {
      i += 1;
      const pct = Math.min(100, Math.round((i / 40) * 100));
      setProgress(pct);
      const stageIdx = Math.min(STAGES.length - 1, Math.floor((i / 40) * STAGES.length));
      setStage(STAGES[stageIdx]);
      if (i >= 40) {
        clearInterval(interval);
        setTimeout(() => {
          setLaunching(false);
          toast.success("Minecraft launched!", {
            description: `${selectedVersion} • ${client?.name} • ${enabledMods} mods active`,
          });
        }, 400);
      }
    }, 90);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="animate-fade-up relative overflow-hidden rounded-3xl border border-border glass p-8 lg:p-12">
        <div className="animate-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> EMBER ENGINE v2.0
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight lg:text-6xl">
            Play <span className="text-gradient-crimson">every version</span>
            <br /> of Minecraft.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            From Alpha 1.0 to the latest snapshot. Built-in performance clients, live
            mod injection, and lightning-fast launches — all in one place.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 animate-float rounded-full bg-gradient-to-br from-primary/30 to-forest/30 blur-2xl lg:block" />
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Boxes, label: "Version", value: selectedVersion, action: () => onNavigate("versions") },
          { icon: Sparkles, label: "Client", value: client?.name ?? "—", action: () => onNavigate("clients") },
          { icon: Puzzle, label: "Active mods", value: String(enabledMods) },
          { icon: Gauge, label: "Boost", value: client?.fps ?? "+0%" },
        ].map((s, i) => (
          <button
            key={s.label}
            onClick={s.action}
            disabled={!s.action}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-up hover-lift group flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4 text-left disabled:cursor-default"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="truncate font-display text-lg font-bold">{s.value}</p>
            </div>
          </button>
        ))}
      </section>

      {/* News */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold">What's new</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <article
              key={n.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className={cn(
                "animate-fade-up hover-lift rounded-2xl border bg-gradient-to-b p-5",
                ACCENT[n.accent],
              )}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                {n.tag}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold">{n.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{n.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Launch bar */}
      <section className="sticky bottom-4 z-30 overflow-hidden rounded-2xl border border-primary/40 glass p-4 glow-crimson lg:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {launching ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> {stage}
                  </span>
                  <span className="font-display font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-ember to-forest transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ready to play</p>
                <p className="font-display text-lg font-bold">
                  {selectedVersion} <span className="text-muted-foreground">·</span>{" "}
                  <span className="text-primary">{client?.name}</span>
                </p>
              </div>
            )}
          </div>
          <button
            onClick={launch}
            disabled={launching}
            className={cn(
              "group relative flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[oklch(0.5_0.22_15)] px-8 py-3.5 font-display text-lg font-extrabold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_var(--crimson-glow)] disabled:opacity-70",
            )}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {launching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
            {launching ? "LAUNCHING" : account.loggedIn ? "PLAY" : "PLAY (Offline)"}
          </button>
        </div>
      </section>
    </div>
  );
}
