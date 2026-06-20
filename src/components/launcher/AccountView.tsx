import { useState } from "react";
import { toast } from "sonner";
import { LogIn, LogOut, ShieldCheck, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLauncher } from "./store";

export function AccountView() {
  const { account, setAccount } = useLauncher();
  const [name, setName] = useState(account.username);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header className="animate-fade-up text-center">
        <h1 className="font-display text-3xl font-extrabold">
          Your <span className="text-gradient-crimson">account</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Sign in with Microsoft or play offline.</p>
      </header>

      <section className="animate-fade-up overflow-hidden rounded-3xl border border-border glass p-8 text-center">
        <div className="animate-glow-pulse mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-forest font-display text-4xl font-extrabold text-primary-foreground">
          {account.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="font-display text-2xl font-bold">{account.username}</h2>
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
            account.loggedIn ? "bg-forest/20 text-forest-glow" : "bg-muted text-muted-foreground",
          )}
        >
          {account.loggedIn ? <ShieldCheck className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
          {account.loggedIn ? "Microsoft verified" : "Offline mode"}
        </p>

        {!account.loggedIn && (
          <div className="mt-6 text-left">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">
              Username
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 px-4 py-3 text-center font-display text-lg outline-none transition-colors focus:border-primary/60"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {account.loggedIn ? (
            <button
              onClick={() => {
                setAccount({ username: name || "Steve", loggedIn: false });
                toast("Signed out");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 py-3 font-bold transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setAccount({ username: name || "Player", loggedIn: true });
                  toast.success("Signed in with Microsoft");
                }}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[oklch(0.5_0.22_15)] py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <LogIn className="h-4 w-4" /> Sign in with Microsoft
              </button>
              <button
                onClick={() => {
                  setAccount({ username: name || "Player", loggedIn: false });
                  toast("Playing in offline mode");
                }}
                className="rounded-xl border border-border bg-muted/40 py-3 font-semibold transition-colors hover:bg-muted"
              >
                Continue offline
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
