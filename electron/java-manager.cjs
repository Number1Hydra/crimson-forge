const fs = require("fs");
const path = require("path");
const https = require("https");
const { createReadStream } = require("fs");
const { createWriteStream } = require("fs");
const AdmZip = require("adm-zip");

/**
 * Java Manager: Downloads and manages a portable JRE for the app
 * Uses Adoptium JRE (free, open-source)
 */

const JAVA_VERSION = "21.0.4";
const JAVA_BUILD = "7";
// Adoptium provides pre-built JRE binaries
const JAVA_URL = `https://github.com/adoptium/temurin21-binaries/releases/download/jdk21.0.4%2B7/OpenJDK21U-jre_x64_windows_hotspot_21.0.4_7.zip`;

let javaPath = null;

function getJavaDir(userDataPath) {
  return path.join(userDataPath, "java-runtime");
}

function getJavaExe(userDataPath) {
  const javaDir = getJavaDir(userDataPath);
  return path.join(javaDir, "jdk21.0.4_7", "bin", "java.exe");
}

function javaExists(userDataPath) {
  const javaExe = getJavaExe(userDataPath);
  return fs.existsSync(javaExe);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          downloadFile(response.headers.location, dest)
            .then(resolve)
            .catch(reject);
          return;
        }

        const totalSize = parseInt(response.headers["content-length"], 10);
        let downloadedSize = 0;

        response.on("data", (chunk) => {
          downloadedSize += chunk.length;
          const percent = Math.round((downloadedSize / totalSize) * 100);
          process.emit("download-progress", percent);
        });

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function ensureJava(userDataPath, onProgress) {
  if (javaExists(userDataPath)) {
    console.log("Java runtime already installed");
    return getJavaExe(userDataPath);
  }

  const javaDir = getJavaDir(userDataPath);
  const zipPath = path.join(javaDir, "java.zip");

  // Create directory if it doesn't exist
  if (!fs.existsSync(javaDir)) {
    fs.mkdirSync(javaDir, { recursive: true });
  }

  try {
    if (onProgress) onProgress({ stage: "Downloading Java Runtime...", percent: 0 });

    console.log(`Downloading Java from ${JAVA_URL}...`);

    // Download with progress tracking
    await new Promise((resolve, reject) => {
      const progressHandler = (percent) => {
        if (onProgress) onProgress({ stage: "Downloading Java Runtime...", percent });
      };
      process.once("download-progress", progressHandler);

      downloadFile(JAVA_URL, zipPath)
        .then(() => {
          process.removeListener("download-progress", progressHandler);
          resolve();
        })
        .catch((err) => {
          process.removeListener("download-progress", progressHandler);
          reject(err);
        });
    });

    if (onProgress) onProgress({ stage: "Extracting Java Runtime...", percent: 50 });
    console.log("Extracting Java...");

    // Extract zip
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(javaDir, true);

    // Clean up zip
    fs.unlinkSync(zipPath);

    if (onProgress) onProgress({ stage: "Java Runtime ready", percent: 100 });
    console.log("Java runtime installed successfully");

    const javaExe = getJavaExe(userDataPath);
    if (!fs.existsSync(javaExe)) {
      throw new Error("Java executable not found after extraction");
    }

    return javaExe;
  } catch (error) {
    console.error("Failed to download/setup Java:", error);
    // Clean up on failure
    try {
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    } catch {}
    throw error;
  }
}

module.exports = {
  ensureJava,
  javaExists,
  getJavaExe,
  getJavaDir,
};
