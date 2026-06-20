const { contextBridge, ipcRenderer } = require("electron");

function subscribe(channel, cb) {
  const listener = (_evt, payload) => cb(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld("crimson", {
  desktop: true,
  getVersions: () => ipcRenderer.invoke("mc:versions"),
  login: () => ipcRenderer.invoke("mc:login"),
  logout: () => ipcRenderer.invoke("mc:logout"),
  getAccount: () => ipcRenderer.invoke("mc:account"),
  launch: (opts) => ipcRenderer.invoke("mc:launch", opts),
  onProgress: (cb) => subscribe("mc:progress", cb),
  onLog: (cb) => subscribe("mc:log", cb),
  onClose: (cb) => subscribe("mc:close", cb),
});
