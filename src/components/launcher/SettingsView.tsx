import { toast } from "sonner";
import { MemoryStick, Monitor, Maximize, FolderCog } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useLauncher } from "./store";

export function SettingsView() {
  const {
    ram,
    setRam,
    fullscreen,
    setFullscreen,
    width,
    setWidth,
    height,
    setHeight,
  } = useLauncher();

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold">
          Launch <span className="text-gradient-crimson">settings</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Tune performance and the game window.</p>
      </header>

      {/* RAM */}
      <section className="animate-fade-up rounded-2xl border border-border bg-card/60 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <MemoryStick className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Memory allocation</h2>
            <p className="text-sm text-muted-foreground">RAM reserved for the JVM</p>
          </div>
          <span className="ml-auto font-display text-2xl font-extrabold text-primary">{ram} GB</span>
        </div>
        <Slider value={[ram]} min={2} max={32} step={1} onValueChange={(v) => setRam(v[0])} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>2 GB</span>
          <span>32 GB</span>
        </div>
      </section>

      {/* Window */}
      <section className="animate-fade-up rounded-2xl border border-border bg-card/60 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/20 text-forest-glow">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Game window</h2>
            <p className="text-sm text-muted-foreground">Resolution & display mode</p>
          </div>
        </div>

        <label className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3.5">
          <span className="flex items-center gap-2 font-medium">
            <Maximize className="h-4 w-4 text-muted-foreground" /> Fullscreen on launch
          </span>
          <Switch checked={fullscreen} onCheckedChange={setFullscreen} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Width" value={width} onChange={setWidth} disabled={fullscreen} />
          <Field label="Height" value={height} onChange={setHeight} disabled={fullscreen} />
        </div>
      </section>

      {/* Java dir (cosmetic) */}
      <section className="animate-fade-up rounded-2xl border border-border bg-card/60 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/20 text-ember">
            <FolderCog className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Runtime & directories</h2>
            <p className="text-sm text-muted-foreground">Managed automatically by Crimson Craft</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <Row label="Java runtime" value="Bundled JRE 21 (auto)" />
          <Row label="Game directory" value="~/.crimsoncraft/instances" />
          <Row label="Mods folder" value="~/.crimsoncraft/mods" />
        </div>
        <button
          onClick={() => toast.success("Settings saved")}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary to-forest py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          Save settings
        </button>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/60 disabled:opacity-50"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  );
}
