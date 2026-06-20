const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

// minecraft-launcher-core + msmc are loaded lazily so a failure to require
// (e.g. missing during dev) doesn't crash window creation.
let Client, Auth;

const GAME_ROOT = path.join(app.getPath("userData"), "minecraft");
const ACCOUNT_FILE = path.join(app.getPath("userData"), "account.json");

let mainWindow = null;
let javaPath = null;

/** mclc-format authorization for the currently signed-in Microsoft account. */
let currentAuth = null;

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

/** Deterministic offline UUID (matches the vanilla "OfflinePlayer:" scheme loosely). */
function offlineUuid(name) {
  const hash = crypto.createHash("md5").update(`OfflinePlayer:${name}`).digest("hex");
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "3" + hash.substring(13, 16),
    "8" + hash.substring(17, 20),
    hash.substring(20, 32),
  ].join("-");
}

function readSavedAccount() {
  try {
    return JSON.parse(fs.readFileSync(ACCOUNT_FILE, "utf8"));
  } catch {
    return null;
  }
}

function saveAccount(data) {
  try {
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to persist account", e);
  }
}

function findSystemJava() {
  try {
    // Try to find java in PATH
    const result = execSync("where java", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
    if (result && fs.existsSync(result)) {
      console.log("Found system Java at:", result);
      return result;
    }
  } catch (e) {
    console.log("Java not found in PATH");
  }
  
  // Try common installation paths on Windows
  const commonPaths = [
    "C:\\Program Files\\Java\\jdk-21\\bin\\java.exe",
    "C:\\Program Files\\Java\\jre-21\\bin\\java.exe",
    "C:\\Program Files (x86)\\Java\\jdk-21\\bin\\java.exe",
    "C:\\Program Files (x86)\\Java\\jre-21\\bin\\java.exe",
    "C:\\Program Files\\AdoptOpenJDK\\jdk-21\\bin\\java.exe",
  ];
  
  for (const javaPath of commonPaths) {
    if (fs.existsSync(javaPath)) {
      console.log("Found system Java at:", javaPath);
      return javaPath;
    }
  }
  
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 940,
    minHeight: 600,
    backgroundColor: "#0b1410",
    title: "Crimson Craft",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer-dist", "index.html"));
}

app.whenReady().then(() => {
  // Restore a persisted Microsoft session into memory.
  const saved = readSavedAccount();
  if (saved?.auth) currentAuth = saved.auth;

  createWindow();

  // Find Java on system
  initializeJava();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Initialize Java runtime
function initializeJava() {
  try {
    send("java:status", { status: "Detecting Java Runtime..." });
    javaPath = findSystemJava();
    
    if (javaPath) {
      send("java:ready", { ready: true });
      console.log("Java runtime ready at:", javaPath);
    } else {
      send("java:error", { error: "Java 17+ not found. Please install Java from java.com or adoptopenjdk.net" });
      console.error("Java not found on system");
    }
  } catch (error) {
    console.error("Failed to initialize Java:", error);
    send("java:error", { error: error.message });
  }
}

// ---------------------------------------------------------------------------
// IPC: versions
// ---------------------------------------------------------------------------
ipcMain.handle("mc:versions", async () => {
  try {
    const res = await fetch(
      "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.versions?.length) return data;
    }
  } catch (e) {
    console.error("version fetch failed", e);
  }
  // Minimal fallback so the UI still renders offline.
  return {
    latest: { release: "1.21.5", snapshot: "25w14a" },
    versions: [
      { id: "1.21.5", type: "release", releaseTime: "2025-03-25T00:00:00+00:00", url: "" },
      { id: "1.20.1", type: "release", releaseTime: "2023-06-12T00:00:00+00:00", url: "" },
      { id: "1.16.5", type: "release", releaseTime: "2021-01-15T00:00:00+00:00", url: "" },
      { id: "1.8.9", type: "release", releaseTime: "2015-12-09T00:00:00+00:00", url: "" },
    ],
  };
});

// ---------------------------------------------------------------------------
// IPC: Microsoft / Minecraft login
// ---------------------------------------------------------------------------
ipcMain.handle("mc:login", async () => {
  if (!Auth) ({ Auth } = require("msmc"));
  const authManager = new Auth("select_account");
  const xboxManager = await authManager.launch("electron");
  const token = await xboxManager.getMinecraft();

  // mclc(true) embeds refresh metadata so the token can be reused/refreshed.
  const mclcAuth = token.mclc(true);
  currentAuth = mclcAuth;
  const account = { username: mclcAuth.name, uuid: mclcAuth.uuid };
  saveAccount({ ...account, auth: mclcAuth });
  return account;
});

ipcMain.handle("mc:logout", async () => {
  currentAuth = null;
  try {
    fs.unlinkSync(ACCOUNT_FILE);
  } catch {
    /* no saved account */
  }
});

ipcMain.handle("mc:account", async () => {
  const saved = readSavedAccount();
  return saved ? { username: saved.username, uuid: saved.uuid } : null;
});

// ---------------------------------------------------------------------------
// IPC: launch Minecraft
// ---------------------------------------------------------------------------
ipcMain.handle("mc:launch", async (_evt, opts) => {
  if (!javaPath) {
    throw new Error("Java runtime not found. Please install Java 17+");
  }

  if (!Client) ({ Client } = require("minecraft-launcher-core"));
  const launcher = new Client();

  const authorization =
    !opts.offline && currentAuth
      ? currentAuth
      : {
          access_token: "0",
          client_token: crypto.randomUUID(),
          uuid: offlineUuid(opts.username || "Player"),
          name: opts.username || "Player",
          user_properties: "{}",
          meta: { type: "msa", demo: false },
        };

  const launchOptions = {
    authorization,
    root: GAME_ROOT,
    version: { number: opts.version, type: "release" },
    memory: { max: `${opts.ram}G`, min: "2G" },
    javaPath: javaPath, // Use system Java
  };

  return new Promise((resolve, reject) => {
    let opened = false;

    launcher.on("progress", (e) => {
      const total = e.total || 1;
      const percent = Math.min(99, Math.round((e.task / total) * 100));
      send("mc:progress", { stage: `Downloading ${e.type}…`, percent });
    });

    launcher.on("download-status", (e) => {
      if (e.total) {
        const percent = Math.min(99, Math.round((e.current / e.total) * 100));
        send("mc:progress", { stage: "Downloading assets…", percent });
      }
    });

    launcher.on("data", (line) => {
      send("mc:log", String(line));
      if (!opened) {
        opened = true;
        send("mc:progress", { stage: "Minecraft is running", percent: 100 });
        resolve({ ok: true });
      }
    });

    launcher.on("close", (code) => {
      send("mc:close", code);
      if (!opened) {
        reject(new Error("Minecraft exited before launching. Check the game logs for details."));
      }
    });

    send("mc:progress", { stage: "Preparing game files…", percent: 2 });
    launcher.launch(launchOptions).catch((err) => {
      if (!opened) reject(new Error(err?.message || String(err)));
    });
  });
});

// IPC: Get Java status
ipcMain.handle("java:status", async () => {
  return {
    ready: !!javaPath,
    path: javaPath,
  };
});
