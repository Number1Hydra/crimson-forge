import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_MODS, type Mod } from "./data";
import { getStoredAccount } from "@/lib/launcher-bridge";

interface Account {
  username: string;
  loggedIn: boolean;
  uuid?: string;
}

interface LauncherState {
  selectedVersion: string;
  setSelectedVersion: (v: string) => void;
  selectedClient: string;
  setSelectedClient: (c: string) => void;
  ram: number;
  setRam: (r: number) => void;
  fullscreen: boolean;
  setFullscreen: (b: boolean) => void;
  width: number;
  setWidth: (n: number) => void;
  height: number;
  setHeight: (n: number) => void;
  account: Account;
  setAccount: (a: Account) => void;
  mods: Mod[];
  toggleMod: (id: string) => void;
  addMod: (mod: Mod) => void;
  removeMod: (id: string) => void;
}

const LauncherContext = createContext<LauncherState | null>(null);

export function LauncherProvider({ children }: { children: ReactNode }) {
  const [selectedVersion, setSelectedVersion] = useState("1.21.5");
  const [selectedClient, setSelectedClient] = useState("lunar");
  const [ram, setRam] = useState(8);
  const [fullscreen, setFullscreen] = useState(true);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [account, setAccount] = useState<Account>({ username: "Steve", loggedIn: false });
  const [mods, setMods] = useState<Mod[]>(DEFAULT_MODS);

  // Restore a previously signed-in Microsoft account in the desktop app.
  useEffect(() => {
    getStoredAccount().then((acc) => {
      if (acc) setAccount({ username: acc.username, loggedIn: true, uuid: acc.uuid });
    });
  }, []);

  const value = useMemo<LauncherState>(
    () => ({
      selectedVersion,
      setSelectedVersion,
      selectedClient,
      setSelectedClient,
      ram,
      setRam,
      fullscreen,
      setFullscreen,
      width,
      setWidth,
      height,
      setHeight,
      account,
      setAccount,
      mods,
      toggleMod: (id) =>
        setMods((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))),
      addMod: (mod) => setMods((prev) => [mod, ...prev]),
      removeMod: (id) => setMods((prev) => prev.filter((m) => m.id !== id)),
    }),
    [selectedVersion, selectedClient, ram, fullscreen, width, height, account, mods],
  );

  return <LauncherContext.Provider value={value}>{children}</LauncherContext.Provider>;
}

export function useLauncher() {
  const ctx = useContext(LauncherContext);
  if (!ctx) throw new Error("useLauncher must be used within LauncherProvider");
  return ctx;
}
