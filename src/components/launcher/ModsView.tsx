import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Puzzle, Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useLauncher } from "./store";
import type { Mod } from "./data";

const CATEGORIES = ["Performance", "Visuals", "HUD", "Gameplay", "Utility"];

export function ModsView() {
  const { mods, toggleMod, addMod, removeMod } = useLauncher();
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const ingest = (names: string[]) => {
    const valid = names.filter((n) => n.toLowerCase().endsWith(".jar"));
    if (!valid.length) {
      toast.error("Only .jar mods are supported");
      return;
    }
    valid.forEach((name, idx) => {
      const clean = name.replace(/\.jar$/i, "");
      const mod: Mod = {
        id: `${clean}-${Date.now()}-${idx}`,
        name: clean,
        author: "Local import",
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        version: "local",
        enabled: true,
      };
      addMod(mod);
    });
    toast.success(`${valid.length} mod${valid.length > 1 ? "s" : ""} injected live`, {
      description: "Applied to the running instance — no restart needed.",
    });
  };

  const enabledCount = mods.filter((m) => m.enabled).length;

  return (
    <div className="space-y-6">
      <header className="animate-fade-up flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">
            Mod <span className="text-gradient-crimson">manager</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {enabledCount} of {mods.length} active · drop a <code className="text-primary">.jar</code> to inject without restarting.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-forest px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" /> Add mod
        </button>
      </header>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          ingest(Array.from(e.dataTransfer.files).map((f) => f.name));
        }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "animate-fade-up flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 text-center transition-all",
          dragging ? "border-primary bg-primary/10 glow-crimson" : "border-border bg-card/40 hover:border-primary/50",
        )}
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Upload className={cn("h-6 w-6 transition-transform", dragging && "animate-bounce")} />
        </div>
        <p className="font-display text-lg font-bold">Drop mods here</p>
        <p className="text-sm text-muted-foreground">Live injection · .jar files · Forge / Fabric</p>
        <input
          ref={fileRef}
          type="file"
          accept=".jar"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) ingest(Array.from(e.target.files).map((f) => f.name));
            e.target.value = "";
          }}
        />
      </div>

      {/* Mod list */}
      <div className="space-y-2.5">
        {mods.map((m, i) => (
          <div
            key={m.id}
            style={{ animationDelay: `${Math.min(i, 15) * 30}ms` }}
            className={cn(
              "animate-fade-up flex items-center gap-3 rounded-xl border bg-card/60 p-3.5 transition-colors",
              m.enabled ? "border-primary/30" : "border-border",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                m.enabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              <Puzzle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{m.name}</p>
                {m.builtIn && (
                  <span className="flex items-center gap-0.5 rounded bg-forest/20 px-1.5 py-0.5 text-[10px] font-bold text-forest-glow">
                    <Zap className="h-2.5 w-2.5" /> BUILT-IN
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {m.author} · {m.category} · v{m.version}
              </p>
            </div>
            <Switch checked={m.enabled} onCheckedChange={() => toggleMod(m.id)} />
            {!m.builtIn && (
              <button
                onClick={() => {
                  removeMod(m.id);
                  toast("Mod removed");
                }}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                aria-label={`Remove ${m.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
