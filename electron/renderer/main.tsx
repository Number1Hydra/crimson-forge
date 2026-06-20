import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles.css";
import { LauncherApp } from "@/components/launcher/LauncherApp";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LauncherApp />
  </React.StrictMode>,
);
