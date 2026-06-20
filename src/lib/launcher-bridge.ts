import { FALLBACK_MANIFEST, type VersionManifest } from "./mc-types";

export interface CrimsonAccount {
  username: string;
  uuid: string;
}

export interface LaunchOptions {
  version: string;
  ram: number;
  username: string;
  offline: boolean;
}

export interface LaunchProgress {
  stage: string;
  percent: number;
}

/**
 * The desktop bridge injected by Electron's preload script (window.crimson).
 * Exists ONLY when running inside the packaged Crimson Craft desktop app.
 */
export interface CrimsonAPI {
  desktop: true;
  getVersions(): Promise<VersionManifest>;
  login(): Promise<CrimsonAccount>;
  logout(): Promise<void>;
  getAccount(): Promise<CrimsonAccount | null>;
  launch(opts: LaunchOptions): Promise<{ ok: boolean }>;
  onProgress(cb: (p: LaunchProgress) => void): () => void;
  onLog(cb: (line: string) => void): () => void;
  onClose(cb: (code: number) => void): () => void;
}

declare global {
  interface Window {
    crimson?: CrimsonAPI;
  }
}

export const isDesktop = (): boolean =>
  typeof window !== "undefined" && !!window.crimson;

/** Works on both web (server route) and desktop (IPC to Mojang). */
export async function loadVersions(): Promise<VersionManifest> {
  if (isDesktop()) {
    return window.crimson!.getVersions();
  }
  try {
    const res = await fetch("/api/versions");
    if (!res.ok) throw new Error("bad status");
    return (await res.json()) as VersionManifest;
  } catch {
    return FALLBACK_MANIFEST;
  }
}

export async function login(): Promise<CrimsonAccount> {
  if (!isDesktop()) throw new Error("Real login is only available in the desktop app.");
  return window.crimson!.login();
}

export async function logout(): Promise<void> {
  if (isDesktop()) await window.crimson!.logout();
}

export async function getStoredAccount(): Promise<CrimsonAccount | null> {
  if (!isDesktop()) return null;
  return window.crimson!.getAccount();
}

export async function launchMinecraft(opts: LaunchOptions): Promise<{ ok: boolean }> {
  if (!isDesktop()) throw new Error("Launching is only available in the desktop app.");
  return window.crimson!.launch(opts);
}

export function subscribeProgress(cb: (p: LaunchProgress) => void): () => void {
  return window.crimson?.onProgress(cb) ?? (() => {});
}

export function subscribeClose(cb: (code: number) => void): () => void {
  return window.crimson?.onClose(cb) ?? (() => {});
}
