# ArchiveJump

> A simple browser extension that helps you access archived versions of articles when paywalls get in the way of learning, research, and staying informed.

## Why I Built This

Sometimes you hit a paywall when researching for school, fact-checking information, or trying to understand different perspectives on current events. Maybe you've already reached your monthly limit, or you're exploring whether a publication is worth subscribing to.

ArchiveJump helps in these moments by connecting you to archived versions that already exist on the public web. It's not about circumventing protections—it's about making it easier to find content that's already been preserved by legitimate archival services.

## ✨ What It Does

**Three ways to access archives:**

1. **Auto-redirect** - Click any article link from supported sites and get redirected to Archive.ph automatically
2. **Context menu** - Right-click any link and select "View archived link" 
3. **Manual search** - Click the extension icon to search the current page

**Smart features:**
- Only redirects actual article links, not homepages or category pages
- Searches Archive.ph first, falls back to Wayback Machine if needed
- Choose between search page or direct latest archive access
- Visual feedback shows what's happening
- Works entirely locally - no data collection

## 🚀 Quick Start

### Installation (2 minutes)

**Option 1: Firefox Add-ons (Available Now)**
- [Install from Mozilla Add-ons](https://addons.mozilla.org/addon/archivejump/)
- Approved and available on the official Firefox store

**Option 2: Manual Install (Chrome/Edge)**
1. [Download from GitHub](https://github.com/dhrm1k/ArchiveJump) 
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer Mode" (toggle in top-right)
4. Click "Load Unpacked" → Select the downloaded folder
5. Done! The ArchiveJump icon appears in your toolbar

**Option 3: Chrome Web Store (Coming Soon)**
- Final preparations in progress for Chrome Web Store listing

### Usage

**Automatic mode:** Visit any news site and click article links - ArchiveJump handles the rest.

**Context menu:** Right-click any link anywhere and select "View archived link" or "Archive current page."

**Manual mode:** Click the extension icon to search the current page or adjust settings.

## 🌍 Supported Sites

Works with 15+ major news sites including:

- The New Yorker, The Atlantic, Washington Post
- New York Times, Wall Street Journal, Financial Times  
- The Economist, Bloomberg, Reuters, The Guardian
- CNN, BBC, NPR, Politico, Slate, Vox, Medium
- And more...

## 🔧 Settings

- **Enable redirects** - Turn the extension on/off
- **Auto-select latest** - Jump directly to newest archive vs. search page

Settings are stored locally on your device using Chrome's storage API. Nothing leaves your computer.

## 🛠️ Development

This repository contains:
- **`extension/`** - The browser extension files
- **`website/`** - Project website ([live site](https://archivejump.netlify.app))

### Extension Development
```bash
# Make changes to extension files
# Reload extension at chrome://extensions/
# Test on supported news sites
```

Key files:
- `manifest.json` - Extension configuration
- `content.js` - Main functionality and link detection  
- `background.js` - Context menu handler
- `popup.html/js` - Extension popup interface

### Website Development
Static site built with vanilla HTML/CSS/JS. Deploy anywhere:
```bash
# Local development
python -m http.server 8000
# or open index.html directly
```

## 🐛 Debugging

Having issues? Check these:
- Open DevTools (F12) → Console for "ArchiveJump:" messages
- Verify extension is enabled in the popup
- Make sure you're on a supported site
- Try the context menu on any link as a fallback

[Report bugs or request features](https://github.com/dhrm1k/ArchiveJump/issues)

## 💙 A Note on Ethics

Quality journalism costs money, and I respect that. Publishers need to sustain their operations and pay their journalists.

ArchiveJump connects you to content that's already been archived by public archival services. If you regularly read a publication, please consider subscribing to support their work. This tool is best used for occasional research, fact-checking, or exploring new publications—not as a replacement for supporting journalism you value.

## 📜 License

MIT License - Open source and free to use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*Made with care for researchers, students, and curious minds everywhere.*
