# ArchiveJump Browser Extension

The core browser extension files for ArchiveJump.

## 📦 Installation

### Method 1: Load Unpacked (Current)
1. Download or clone the main repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer Mode" (toggle in top-right)
4. Click "Load Unpacked"
5. Select this `extension/` folder
6. The ArchiveJump icon will appear in your toolbar

### Method 2: Chrome Web Store (Coming Soon)
We're working on getting ArchiveJump listed in the Chrome Web Store for easier installation.

## 🎮 Usage

### Automatic Mode
- Visit any supported news site (NYT, WSJ, The Atlantic, etc.)
- Click on article links
- ArchiveJump automatically redirects to archived versions

### Manual Mode
- Click the ArchiveJump icon in your toolbar
- Click "Jump to Archive.ph" to search the current page
- Toggle settings as needed

### Settings
- **Enable redirects**: Turn the extension on/off
- **Auto-select latest**: Jump directly to newest archive vs. search page

## 🔧 Configuration

The extension stores settings locally using Chrome's storage API. No data leaves your device.

## 🌍 Supported Sites

- The New Yorker
- The Atlantic
- Washington Post  
- New York Times
- Wall Street Journal
- Financial Times
- The Economist
- Bloomberg
- Reuters
- The Guardian
- CNN, BBC, NPR
- Politico, Slate, Vox
- Medium
- And more...

## 🛠️ Development

### File Structure
- `manifest.json` - Extension configuration
- `content.js` - Main functionality and link detection
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic and settings
- `icon.png` - Extension icon

### Key Features
- Smart article link detection
- Multiple archive source fallback
- Visual feedback notifications
- Privacy-focused design
- Minimal permissions

### Testing
1. Make changes to files
2. Go to `chrome://extensions/`
3. Click "Reload" on the ArchiveJump extension
4. Test on supported news sites

## 🐛 Debugging

- Open DevTools (F12) and check Console for "ArchiveJump:" messages
- Verify extension is enabled in popup
- Check if site is in supported sites list
- Test on known article URLs

## 📝 Version History

See the main repository's releases for version history and changes.
