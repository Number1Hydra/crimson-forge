# CrimsonCraft Launcher - Build Instructions

## Quick Start to Build & Download

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

### Step 1: Install Dependencies
```bash
npm install
# or if using bun:
bun install
```

### Step 2: Build the Launcher
```bash
npm run electron:win
```

This will:
1. Build the React UI
2. Package everything into an Electron app
3. **Automatically create `CrimsonCraft-Launcher.zip`** in the `electron-release` folder

### Step 3: Download Your Launcher
The zip file will be at:
```
electron-release/CrimsonCraft-Launcher.zip
```

---

## What's Inside the Zip?

- ✅ Complete CrimsonCraft executable (no installation needed)
- ✅ All dependencies bundled
- ✅ **Java 21 will auto-download on first launch** (no manual Java install required!)
- ✅ Official Minecraft launcher integration

---

## For Users Downloading the Launcher

1. **Extract** `CrimsonCraft-Launcher.zip` to any folder
2. **Run** `CrimsonCraft.exe`
3. **First launch**: App will download Java (~150MB) - this is normal, only happens once
4. **Play**: Enjoy Minecraft!

---

## Build Options

- `npm run electron:win` - Build + create zip file ⭐ **USE THIS**
- `npm run electron:win:simple` - Build without zipping
- `npm run electron:dev` - Run development version locally
- `npm run electron:linux` - Build for Linux

---

## Troubleshooting

### "Java won't download"
- Check internet connection
- The app downloads from GitHub (Adoptium). If blocked, you may need a VPN.
- Logs are in: `%APPDATA%/CrimsonCraft/`

### "Game won't launch"
- Make sure Java finishes downloading on first run
- Check that Minecraft account is properly logged in

### Need Help?
- Check the app logs in `%APPDATA%/CrimsonCraft/`
- Make sure you're running the latest version

---

## For Developers

The app structure:
```
electron/
  ├── main.cjs          # Electron main process (Java manager, launcher)
  ├── java-manager.cjs  # Handles Java auto-download
  ├── preload.cjs       # Security layer
  └── renderer/         # React UI
```

Java is automatically managed - no system Java needed! 🎉
