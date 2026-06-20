import { useState } from "react";
import { Toaster } from "sonner";
import { AnimatedBackground } from "./AnimatedBackground";
import { Sidebar } from "./Sidebar";
import { HomeView } from "./HomeView";
import { VersionsView } from "./VersionsView";
import { ClientsView } from "./ClientsView";
import { ModsView } from "./ModsView";
import { SettingsView } from "./SettingsView";
import { AccountView } from "./AccountView";
import { LauncherProvider } from "./store";
import type { ViewId } from "./data";

/** The full Crimson Craft launcher shell, shared by the web app and the desktop renderer. */
export function LauncherApp() {
  const [view, setView] = useState<ViewId>("home");

  return (
    <LauncherProvider>
      <div className="relative flex min-h-screen text-foreground">
        <AnimatedBackground />
        <Sidebar active={view} onChange={setView} />
        <main className="relative z-10 flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-10 lg:py-10">
            {view === "home" && <HomeView onNavigate={setView} />}
            {view === "versions" && <VersionsView />}
            {view === "clients" && <ClientsView />}
            {view === "mods" && <ModsView />}
            {view === "settings" && <SettingsView />}
            {view === "account" && <AccountView />}
          </div>
        </main>
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.21 0.035 152)",
            border: "1px solid oklch(0.45 0.06 150 / 30%)",
            color: "oklch(0.95 0.01 120)",
          },
        }}
      />
    </LauncherProvider>
  );
}
