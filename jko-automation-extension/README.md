# JKO Course Automator - Chrome Extension

Automatically complete JKO courses with SCORM tracking and progress monitoring.

## Features

- ✅ Automatically clicks Start/Resume buttons
- ✅ Completes lessons via SCORM API
- ✅ Verifies completion checkmarks before proceeding
- ✅ Auto-clicks "Next Lesson"
- ✅ Monitors progress and auto-exits at threshold (default 93%)
- ✅ Configurable settings via popup UI
- ✅ Real-time status and logging

## Installation

1. **Download the extension folder** (`jko-automation-extension`)

2. **Open Chrome and navigate to:**
   ```
   chrome://extensions/
   ```

3. **Enable "Developer mode"** (toggle in top-right corner)

4. **Click "Load unpacked"**

5. **Select the `jko-automation-extension` folder**

6. **Done!** The extension icon will appear in your toolbar

## Usage

1. **Navigate to a JKO course** on `https://jkodirect.jten.mil`

2. **Click the extension icon** in your toolbar

3. **Click "▶️ Start Automation"**

4. The extension will:
   - Click Start/Resume if needed
   - Complete each lesson
   - Verify checkmarks
   - Click Next Lesson
   - Exit when progress reaches threshold

## Settings

### Exit at Progress (%)
- Default: **93%**
- The extension will auto-exit when progress reaches this percentage

### Max Retries per Lesson
- Default: **10**
- How many times to retry a lesson before forcing "Next"

## Popup Controls

- **▶️ Start Automation** - Begin the automation
- **⏹️ Stop Automation** - Stop the automation
- **Settings** - Configure threshold and max retries
- **Log** - View real-time activity log

## Status Indicators

- **Running** (green) - Automation is active
- **Stopped** (red) - Automation is inactive
- **Progress** - Current course completion percentage
- **Target** - Configured exit threshold

## Notes

- Only works on JKO domains (`*.jten.mil`)
- Requires access to course iframes
- Settings are saved automatically
- Works with SCORM 2004 courses

## Troubleshooting

**Extension not working?**
- Make sure you're on the JKO course page
- Reload the page after installing
- Check browser console for errors

**Progress not updating?**
- The progress element may be in a different iframe
- Check the console logs for details

**Lessons not completing?**
- SCORM API may not be loaded yet
- Extension will retry automatically

## Privacy

- No data is sent externally
- All automation happens locally in your browser
- Settings stored in Chrome sync storage

## License

For educational and authorized use only.
