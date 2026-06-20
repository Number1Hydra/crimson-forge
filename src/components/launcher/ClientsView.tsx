import { toast } from "sonner";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUILT_IN_CLIENTS } from "./data";
import { useLauncher } from "./store";

const COLOR: Record<string, { ring: string; chip: string; glow: string }> = {
  crimson: { ring: "border-primary/50", chip: "bg-primary/20 text-primary", glow: "glow-crimson" },
  forest: { ring: "border-forest/50", chip: "bg-forest/25 text-forest-glow", glow: "glow-forest" },
  ember: { ring: "border-ember/50", chip: "bg-ember/20 text-ember", glow: "" },
};

export function ClientsView() {
  const { selectedClient, setSelectedClient } = useLauncher();

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold">
          Built-in <span className="text-gradient-crimson">clients</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          One-click optimized clients with bundled mods. Switch any time — no reinstall.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BUILT_IN_CLIENTS.map((c, i) => {
          const isActive = selectedClient === c.id;
          const color = COLOR[c.color];
          return (
            <article
              key={c.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "animate-fade-up hover-lift relative flex flex-col overflow-hidden rounded-2xl border bg-card/60 p-5",
                isActive ? cn(color.ring, color.glow) : "border-border",
              )}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.tagline}</p>
                </div>
                <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", color.chip)}>
                  <Zap className="h-3 w-3" /> {c.fps}
                </span>
              </div>

              <ul className="mb-5 flex-1 space-y-1.5">
                {c.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-forest-glow" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedClient(c.id);
                  toast.success(`${c.name} selected`, { description: "Client ready for next launch." });
                }}
                className={cn(
                  "rounded-xl py-2.5 text-sm font-bold transition-all",
                  isActive
                    ? "bg-gradient-to-r from-primary to-forest text-primary-foreground"
                    : "border border-border bg-muted/50 hover:bg-muted",
                )}
              >
                {isActive ? "✓ Active" : "Select client"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
