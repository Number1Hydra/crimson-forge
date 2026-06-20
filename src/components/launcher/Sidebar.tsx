import { cn } from "@/lib/utils";
import {
  Home,
  Boxes,
  Sparkles,
  Puzzle,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/crimson-logo.png";
import type { ViewId } from "./data";
import { useLauncher } from "./store";

const NAV: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "versions", label: "Versions", icon: Boxes },
  { id: "clients", label: "Clients", icon: Sparkles },
  { id: "mods", label: "Mods", icon: Puzzle },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "account", label: "Account", icon: User },
];

export function Sidebar({
  active,
  onChange,
}: {
  active: ViewId;
  onChange: (v: ViewId) => void;
}) {
  const { account } = useLauncher();

  return (
    <aside className="z-20 flex w-[88px] flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar/80 py-5 backdrop-blur-xl lg:w-64 lg:items-stretch lg:px-4">
      <div className="mb-4 flex items-center gap-3 px-2 lg:px-1">
        <div className="animate-glow-pulse relative shrink-0 rounded-xl">
          <img
            src={logo}
            alt="Crimson Craft logo"
            width={44}
            height={44}
            className="h-11 w-11 drop-shadow-[0_0_10px_var(--crimson-glow)]"
          />
        </div>
        <div className="hidden flex-col leading-none lg:flex">
          <span className="font-display text-lg font-extrabold text-gradient-crimson">
            CRIMSON
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.35em] text-muted-foreground">
            CRAFT
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "group relative flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all lg:justify-start",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_var(--crimson-glow)]" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-primary",
                )}
              />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => onChange("account")}
        className="mt-2 flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2.5 transition-colors hover:bg-sidebar-accent"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-forest font-display text-sm font-bold text-primary-foreground">
          {account.username.charAt(0).toUpperCase()}
        </div>
        <div className="hidden flex-col items-start leading-tight lg:flex">
          <span className="text-sm font-semibold">{account.username}</span>
          <span className={cn("text-xs", account.loggedIn ? "text-forest-glow" : "text-muted-foreground")}>
            {account.loggedIn ? "● Online" : "Offline"}
          </span>
        </div>
      </button>
    </aside>
  );
}
