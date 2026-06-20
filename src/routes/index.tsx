import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { AnimatedBackground } from "@/components/launcher/AnimatedBackground";
import { Sidebar } from "@/components/launcher/Sidebar";
import { HomeView } from "@/components/launcher/HomeView";
import { VersionsView } from "@/components/launcher/VersionsView";
import { ClientsView } from "@/components/launcher/ClientsView";
import { ModsView } from "@/components/launcher/ModsView";
import { SettingsView } from "@/components/launcher/SettingsView";
import { AccountView } from "@/components/launcher/AccountView";
import { LauncherProvider } from "@/components/launcher/store";
import type { ViewId } from "@/components/launcher/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crimson Craft — Minecraft Launcher" },
      {
        name: "description",
        content:
          "Crimson Craft: a fast, modern Minecraft launcher. Play every version, switch built-in clients like Lunar & Badlion, and inject mods live without restarting.",
      },
      { property: "og:title", content: "Crimson Craft — Minecraft Launcher" },
      {
        property: "og:description",
        content: "Play every Minecraft version with built-in clients and live mod injection.",
      },
    ],
  }),
  component: Index,
});

function Index() {
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
