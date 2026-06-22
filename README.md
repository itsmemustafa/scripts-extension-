# Dispatch Box 📋
<img width="383" height="600" alt="image" src="https://github.com/user-attachments/assets/2e3680b3-7ec9-489c-a62b-a68faffe2391" />

A Chrome Extension (Manifest V3) for dispatch agents to quickly copy and paste ready-made scripts in Arabic, English, and Kurdish (Sorani).

---

## Features

- **3 Categories** — Driver, Customer, General
- **Multilingual scripts** — Each script has Arabic, English, and Kurdish (CKB) versions
- **One-click copy** — Copy any script to clipboard instantly
- **Script Manager** — Add, edit, delete, and reorder scripts via the Settings page
- **Drag & Drop reordering** — Rearrange scripts in any order you prefer
- **Export / Import** — Back up and restore your scripts as a JSON file
- **Persistent storage** — All scripts are saved in `chrome.storage.local`

---

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the project folder.
5. The **Dispatch Box** icon will appear in your Chrome toolbar.

---

## Usage

### Popup
- Click the extension icon to open the popup.
- Select a category tab: **Driver**, **Customer**, or **General**.
- Switch the language of any script using the **AR / EN / KRD** buttons on each card.
- Click **Copy** to copy the script text to your clipboard.
- Click the **⚙️ gear icon** to open the Settings page.

### Settings Page
- **Add a script** — Click **New Script**, fill in the title, category, and text in all three languages, then click **Save Script**.
- **Edit a script** — Click any script card to open the edit drawer.
- **Delete a script** — Open the edit drawer and click **Delete Script**.
- **Reorder scripts** — Drag and drop cards to change their order (saved automatically).
- **Export** — Click **Export JSON** to download a backup of all your scripts.
- **Import** — Click **Import JSON** to restore from a backup file. You can choose to merge with or replace existing scripts.

---

## Project Structure

```
scripts-extention/
├── manifest.json       # Chrome extension manifest (MV3)
├── background.js       # Service worker
├── data.js             # Default seed scripts
├── popup.html          # Main popup UI
├── popup.css           # Popup styles
├── popup.js            # Popup logic
├── options.html        # Settings page UI
├── options.css         # Settings page styles
├── options.js          # Settings page logic
├── icons/              # Extension icons (16, 48, 128px)
└── README.md           # This file
```

---

## Data Format

Scripts are stored in `chrome.storage.local` as a JSON array. Each script follows this structure:

```json
{
  "id": "unique-id",
  "category": "driver",
  "title": "Driver delayed",
  "text": {
    "ar": "النص العربي هنا",
    "en": "English text here",
    "ckb": "دەقی کوردی لێرەدایە"
  },
  "updatedAt": "2026-06-22T00:00:00.000Z"
}
```

**Categories:** `driver` | `customer` | `general`

---

## Resetting to Default Scripts

If you want to reset all scripts to the built-in defaults:

1. Go to `chrome://extensions/`.
2. Click **Remove** to uninstall the extension.
3. Click **Load unpacked** to reinstall it from the project folder.

This clears `chrome.storage.local` and re-seeds from `data.js`.

---

## Built With

- HTML, CSS, Vanilla JavaScript
- Chrome Extensions API (Manifest V3)
- `chrome.storage.local` for persistence
- `navigator.clipboard` for copy functionality

---

## License

MIT — Free to use and modify.
#
