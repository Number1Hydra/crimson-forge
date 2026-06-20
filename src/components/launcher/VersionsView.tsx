import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Check, Loader2, Boxes, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMinecraftVersions, type MinecraftVersion } from "@/lib/minecraft.functions";
import { useLauncher } from "./store";

type Filter = "all" | "release" | "snapshot" | "old_beta" | "old_alpha";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "release", label: "Releases" },
  { id: "snapshot", label: "Snapshots" },
  { id: "old_beta", label: "Beta" },
  { id: "old_alpha", label: "Alpha" },
];

const TYPE_BADGE: Record<string, string> = {
  release: "bg-forest/20 text-forest-glow border-forest/40",
  snapshot: "bg-primary/20 text-primary border-primary/40",
  old_beta: "bg-ember/20 text-ember border-ember/40",
  old_alpha: "bg-muted text-muted-foreground border-border",
};

export function VersionsView() {
  const { selectedVersion, setSelectedVersion } = useLauncher();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["mc-versions"],
    queryFn: () => getMinecraftVersions(),
    staleTime: 1000 * 60 * 30,
  });

  const versions = useMemo<MinecraftVersion[]>(() => {
    let list = data?.versions ?? [];
    if (filter !== "all") list = list.filter((v) => v.type === filter);
    if (query.trim()) list = list.filter((v) => v.id.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [data, filter, query]);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold">
          Version <span className="text-gradient-crimson">library</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          {data ? `${data.versions.length} versions` : "Loading"} — pulled live from Mojang.
          Latest release: <span className="text-forest-glow">{data?.latest.release ?? "…"}</span>
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search versions…"
            className="w-full rounded-xl border border-input bg-card/60 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Fetching versions…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {versions.map((v, i) => {
            const isSelected = selectedVersion === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v.id)}
                style={{ animationDelay: `${Math.min(i, 20) * 20}ms` }}
                className={cn(
                  "animate-fade-up hover-lift group relative overflow-hidden rounded-xl border bg-card/60 p-4 text-left",
                  isSelected ? "border-primary glow-crimson" : "border-border hover:border-primary/40",
                )}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <Boxes className={cn("mb-2 h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <p className="truncate font-display text-base font-bold">{v.id}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      TYPE_BADGE[v.type],
                    )}
                  >
                    {v.type.replace("old_", "")}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(v.releaseTime).getFullYear()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
