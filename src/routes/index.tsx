import { createFileRoute } from "@tanstack/react-router";
import { LauncherApp } from "@/components/launcher/LauncherApp";

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
  component: LauncherApp,
});
