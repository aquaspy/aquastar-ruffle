# 🌊 Aquastar Ruffle  

A lightweight, Electron-based launcher that brings **AdventureQuest Worlds** back to life using the open-source **Ruffle Flash emulator**—no official Flash player required.

---

## ✨ What it does
- Boots AQW in a native window via Ruffle  
- Proxies the original TCP traffic over WebSocket (so Ruffle can reach the AQW back-end)  
- Ships with an in-game FPS counter and optional hardware-accelerated rendering
- Displays the Game FPS. FPS is actually better for animations, but it is still not great with many players in the same room. It should improve as soon as ruffle gets the first stable release!

---

## 🛠️ How to build
1. Clone or download this repo  
2. `npm install` (installs Electron + ws)  
3. `npm run make`

---
## 🚀 Using the project
1. Download the release for your OS at the releases page
2. Choose your intendend server
3. Login and play in that server
   OBS: You need to restart the launcher in order to play on another server.

---

## 🖥️ Controls & tips
- `F11` – toggle fullscreen  
- Drag the corner to resize; the SWF scales to fit  
- FPS counter sits in the upper-left for performance tuning  

---

## ⚙️ How it works
- `main.js` spins up a single WebSocket→TCP bridge on `localhost:8181`  
- Ruffle’s `socketProxy` config transparently tunnels AQW’s raw TCP traffic through that bridge  
- `index.html` embeds Ruffle, passes the chosen server, and loads the official `Loader_Spider.swf`  
- All traffic is still to/from official Artix servers—no piracy, no private server  

---

## 🔧 Tweaking
Edit `index.html` to:
- Change default quality (`low | medium | high`)  
- Toggle the FPS counter or adjust its position  
- Swap in a different SWF if Artix ever updates the loader  

Edit `main.js` to:
- Add more servers (just follow the `servers` map syntax)  
- Change default window size or enable additional GPU flags  

---

## 🛠️ Requirements
- Node.js ≥ 14  
- Any GPU that Electron accepts (all major vendors work)  

---

## 📄 License
MIT – do whatever you want; just don’t sell the installer bundled with malware, please.

---

## ⚠️ Disclaimer
Aquastar Ruffle is an independent fan project.  
Artix Entertainment and AdventureQuest Worlds are trademarks of their respective owners.
