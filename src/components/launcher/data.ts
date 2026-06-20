export type ViewId = "home" | "versions" | "clients" | "mods" | "settings" | "account";

export interface BuiltInClient {
  id: string;
  name: string;
  tagline: string;
  fps: string;
  color: "crimson" | "forest" | "ember";
  features: string[];
}

export interface Mod {
  id: string;
  name: string;
  author: string;
  category: string;
  version: string;
  enabled: boolean;
  builtIn?: boolean;
}

export const BUILT_IN_CLIENTS: BuiltInClient[] = [
  {
    id: "vanilla",
    name: "Vanilla+",
    tagline: "Pure Minecraft, optimized",
    fps: "+40% FPS",
    color: "forest",
    features: ["Optifine-style rendering", "Zero bloat", "Fast launch"],
  },
  {
    id: "lunar",
    name: "Lunar Client",
    tagline: "The competitive favorite",
    fps: "+90% FPS",
    color: "crimson",
    features: ["Built-in mods", "Cosmetics", "Borderless fullscreen", "Discord RPC"],
  },
  {
    id: "badlion",
    name: "Badlion Client",
    tagline: "Mods, anti-cheat & analytics",
    fps: "+75% FPS",
    color: "ember",
    features: ["100+ mods", "FPS booster", "Replay mod", "Schematica"],
  },
  {
    id: "feather",
    name: "Feather Client",
    tagline: "Lightweight & smooth",
    fps: "+60% FPS",
    color: "forest",
    features: ["Featherboard", "Snappy UI", "Server integrations"],
  },
  {
    id: "labymod",
    name: "LabyMod",
    tagline: "Customizable & social",
    fps: "+55% FPS",
    color: "crimson",
    features: ["Voice chat", "Custom HUD", "Emotes", "Addons store"],
  },
  {
    id: "forge",
    name: "Forge / Fabric",
    tagline: "Full modloader support",
    fps: "Modded",
    color: "ember",
    features: ["10,000+ mods", "Modpacks", "Custom dimensions"],
  },
];

export const DEFAULT_MODS: Mod[] = [
  { id: "sodium", name: "Sodium", author: "CaffeineMC", category: "Performance", version: "0.6.5", enabled: true, builtIn: true },
  { id: "lithium", name: "Lithium", author: "CaffeineMC", category: "Performance", version: "0.14.3", enabled: true, builtIn: true },
  { id: "iris", name: "Iris Shaders", author: "IrisShaders", category: "Visuals", version: "1.8.1", enabled: true, builtIn: true },
  { id: "minimap", name: "Xaero's Minimap", author: "xaero96", category: "HUD", version: "24.2.0", enabled: false, builtIn: true },
  { id: "fps", name: "FPS Reducer", author: "bre2el", category: "Performance", version: "2.4", enabled: false, builtIn: true },
];

export const NEWS = [
  {
    tag: "Update",
    title: "Crimson Craft 2.0 — Ember Engine",
    body: "Faster launches, live mod injection, and a redesigned client hub.",
    accent: "crimson" as const,
  },
  {
    tag: "New",
    title: "Every Minecraft version, instantly",
    body: "From Alpha 1.0 to the latest snapshot — pulled live from Mojang.",
    accent: "forest" as const,
  },
  {
    tag: "Mods",
    title: "Hot-swap mods without restarting",
    body: "Drop a .jar in and it's injected on the fly. No relaunch needed.",
    accent: "ember" as const,
  },
];
