# 🌊 Aquastar Ruffle  

A lightweight, Electron-based launcher that brings **AdventureQuest Worlds** back to life using the open-source **Ruffle Flash emulator**—no official Flash player required.

---

## ✨ What it does
- Boots AQW directly in a native window via Ruffle  
- Auto-proxies all AQW TCP socket endpoints over WebSocket (no server picker needed)  
- Ships with optional hardware-accelerated rendering and an FPS counter for tuning
- Displays the Game FPS. FPS is actually better for animations, but it is still not great with many players in the same room. It should improve as soon as ruffle gets the first stable release!

---

## 🛠️ How to build

### Local dev
```bash
npm install --include=dev
npm start
```

### Local installer (current OS)
```bash
npm install --include=dev
npm run build
```
Output lands in `dist/`.

### Official releases (all platforms)
Releases are built automatically by GitHub Actions when a version tag is pushed:

```bash
# bump version in package.json, then:
git add package.json
git commit -m "Bump version to X.Y.Z"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

CI builds **Linux AppImage** (x64 + arm64), **Windows NSIS**, and **macOS DMG** (universal, unsigned) and attaches them to the GitHub Release.

Nothing extra to install locally for releases — builds run on GitHub's runners. You only need `git` and `gh` (or a browser) to tag and monitor the workflow.

---
## 🚀 Using the project
1. Download the release for your OS at the releases page
2. Launch the app — the game loads immediately
3. Pick your server in AQW's in-game server list and play
   - No restart needed to switch servers

---

## 🖥️ Controls & tips
- `F11` – toggle fullscreen  
- Drag the corner to resize; the SWF scales to fit  
- Set `SHOW_FPS = true` in `index.html` to enable the upper-left FPS counter  

---

## ⚙️ How it works
- `main.js` spins up a WebSocket→TCP bridge on `localhost:8181` (accepts any host/port)  
- Ruffle (web) cannot open raw TCP — each `(host, port)` the SWF uses must be listed in `socketProxy`  
- **On every launch**, `index.html` fetches the live server list from Artix and registers each `(host, port)` in `socketProxy` automatically — no manual updates needed when Artix changes servers  
- Pick your server in AQW's in-game list; no restart needed to switch  
- All traffic is still to/from official Artix servers—no piracy, no private server  

---

## 🌐 Where AQW socket hosts & ports come from

Artix publishes the live server list in a JSON API that the game client (`spider.swf`) already uses:

```
https://game.aq.com/game/api/data/servers
```

Each entry looks like:

```json
{"sName":"Espada","sIP":"sock7.aq.com","iPort":5592,"iCount":18,...}
```

| Field | Meaning |
|-------|---------|
| `sName` | Server name shown in the in-game server list (Twilly, Artix, …) |
| `sIP` | **Hostname** the SWF passes to `Socket.connect()` — this is what Ruffle's `socketProxy` must match |
| `iPort` | TCP port for that server |

**This launcher reads that API automatically.** You do not need to maintain a server list by hand.

As of mid-2026, Artix moved from old `socket*.aq.com` hostnames to `sock7.aq.com` / `sock8.aq.com` (behind Cloudflare IPs like `172.65.225.46`). The API always returns the current hostnames — Ruffle needs the hostname string, not the resolved IP.

Port **843** is also registered for each host (Flash cross-domain policy socket).

### How to check the list yourself

**Quick view (browser or terminal):**
```bash
curl -sL "https://game.aq.com/game/api/data/servers" | python3 -m json.tool
```

**Unique hosts and ports:**
```bash
curl -sL "https://game.aq.com/game/api/data/servers" | python3 -c "
import json, sys
for s in json.load(sys.stdin):
    print(f\"{s['sName']:15} {s['sIP']:25} port {s['iPort']}\")
"
```

**If a connection still fails** — open DevTools in the game window (`Ctrl+Shift+I`) and look for:
```
Missing WebSocket proxy for host sock7.aq.com, port 5595
```
That line tells you exactly which `(host, port)` pair needs to be added.

**Optional: watch live TCP connections** (like `aquastar_connections.log`) with:
```bash
watch -n2 'ss -tnp | grep -E "electron|aquastar"'
```
Useful to see resolved IPs, but remember Ruffle matches on the **hostname** from the API, not the IP.

### If the API goes down

`index.html` keeps a `FALLBACK_HOSTS` map as a safety net. Update it only if the API is unreachable and Artix has changed infrastructure:

```javascript
const FALLBACK_HOSTS = {
  'sock7.aq.com':        [5588, 5589, 5591, 5592, 5593, 5594, 843],
  'sock8.aq.com':        [5588, 5589, 5590, 5591, 5593, 843],
  'euro.aqw.artix.com':  [5588, 843],
  'asia.game.artix.com': [5588, 843]
};
```

Re-fetch the API with `curl` (above) to get the current values.

---

## 🔧 Tweaking

- Ruffle uses its own balanced defaults (auto renderer, SWF quality, letterbox, etc.) — only splash/preloader are disabled for faster launch  
- Crowded-room FPS is mostly limited by Ruffle itself, not this launcher  
- Set `SHOW_FPS = true` in `index.html` to overlay an FPS counter  
- Update `FALLBACK_HOSTS` only if the Artix API is down (see section above)  
- Edit `main.js` to change default window size (currently 1280×720)

---

## 🛠️ Requirements
- Node.js ≥ 14  
- Any GPU that Electron accepts (all major vendors work)  

---

## 📄 License
MIT – do whatever you want; just don't sell the installer bundled with malware, please.

---

## ⚠️ Disclaimer
Aquastar Ruffle is an independent fan project.  
Artix Entertainment and AdventureQuest Worlds are trademarks of their respective owners.