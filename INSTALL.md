# Installation Instructions

## Step 1: Generate Icons (Choose ONE method)

### Method A: Use the HTML Generator (Easiest)
1. Open `icons/create-icons.html` in your web browser
2. Click the three download links:
   - Download icon16.png
   - Download icon48.png
   - Download icon128.png
3. Move the downloaded files into the `icons/` folder

### Method B: Use Python Script
```bash
pip install Pillow
python3 generate_icons.py
```

### Method C: Use Any PNG Images
- Find or create three PNG images (16x16, 48x48, 128x128 pixels)
- Name them `icon16.png`, `icon48.png`, `icon128.png`
- Place them in the `icons/` folder

## Step 2: Install Extension in Chrome

1. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

2. Enable **"Developer mode"** (toggle switch in top-right corner)

3. Click **"Load unpacked"**

4. Select the `jko-automation-extension` folder

5. The extension should now appear in your extensions list!

## Step 3: Pin the Extension (Optional)

1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "JKO Course Automator"
3. Click the pin icon to keep it visible

## Step 4: Use the Extension

1. Navigate to a JKO course: `https://jkodirect.jten.mil`
2. Click the extension icon
3. Click "▶️ Start Automation"
4. Watch it work!

## Troubleshooting

### Icons Missing Error
- Make sure you generated the icon files (see Step 1)
- The icons folder should contain: icon16.png, icon48.png, icon128.png

### Extension Not Loading
- Make sure all files are in the folder:
  - manifest.json
  - content.js
  - popup.html
  - popup.js
  - icons/icon16.png
  - icons/icon48.png
  - icons/icon128.png

### Extension Not Working on JKO
- Make sure you're on the correct domain: `*.jten.mil`
- Reload the page after installing the extension
- Check the browser console (F12) for errors

## Updating the Extension

If you make changes to the code:

1. Go to `chrome://extensions/`
2. Click the refresh icon (🔄) on the JKO Course Automator card
3. The changes will take effect immediately

## Uninstalling

1. Go to `chrome://extensions/`
2. Click "Remove" on the JKO Course Automator card
