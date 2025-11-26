# JKO Course Automation

Automates course completion on [jkodirect.jten.mil](https://jkodirect.jten.mil/) using AI vision capabilities. The script intelligently navigates through course content, reads lessons, and answers multiple-choice tests using either Claude API or Ollama.

## Features

- **AI-Powered Navigation**: Uses vision AI to understand the screen and make intelligent decisions
- **Adaptive Course Handling**: Works with different course layouts and variations
- **Multiple Choice Test Solving**: Automatically answers quiz questions using AI analysis
- **Dual AI Provider Support**: Works with both Claude API and Ollama (local)
- **Progress Tracking**: Saves screenshots for debugging and progress monitoring
- **Linux Compatible**: Fully tested on Arch Linux (works on all Linux distros)

## Prerequisites

### System Requirements

- Python 3.8 or higher
- Linux (tested on Arch, works on Ubuntu/Debian/Fedora/etc.)
- Internet connection for JKO website access

### AI Provider Setup

Choose one of the following:

#### Option 1: Claude API (Recommended)

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Set it as an environment variable:
   ```bash
   export ANTHROPIC_API_KEY='your-api-key-here'
   ```

#### Option 2: Ollama (Local/Free)

1. Install Ollama:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. Pull a vision-capable model:
   ```bash
   ollama pull llava
   ```

3. Ensure Ollama is running:
   ```bash
   ollama serve
   ```

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd Test_Project
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Linux
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:
   ```bash
   playwright install chromium
   ```

## Usage

### Standard Workflow

The script follows a simple 3-step process:

1. **Script opens JKO home page** - Browser window opens at jkodirect.jten.mil
2. **You log in manually** - Use your credentials (CAC, username/password, etc.)
3. **Navigate to a course** - Click on the course you want to complete
4. **Press Enter** - The AI takes over and completes the course automatically

### Basic Usage with Claude API

```bash
# Start the script
python jko_course_automation.py

# Browser opens, you log in and navigate to a course
# Press Enter when ready
# AI takes over and completes the course!
```

### Using Ollama (Local)

```bash
python jko_course_automation.py --ai-provider ollama

# Follow the same login process
# Press Enter when on course page
```

### Advanced Options

```bash
# Run with debug output (recommended for first time)
python jko_course_automation.py --debug

# Start at a specific URL (e.g., if already logged in)
python jko_course_automation.py --start-url "https://jkodirect.jten.mil/my/courses"

# Use specific Ollama model
python jko_course_automation.py --ai-provider ollama --ollama-model llava:13b

# Specify Claude API key directly
python jko_course_automation.py --claude-api-key "sk-ant-..."

# Set maximum iterations (default: 500)
python jko_course_automation.py --max-iterations 1000

# Note: --headless mode is NOT recommended as you need to log in manually
```

### Full Command Line Options

```
usage: jko_course_automation.py [-h] [--start-url START_URL]
                                [--ai-provider {claude,ollama}]
                                [--claude-api-key CLAUDE_API_KEY]
                                [--ollama-url OLLAMA_URL]
                                [--ollama-model OLLAMA_MODEL]
                                [--headless] [--debug]
                                [--max-iterations MAX_ITERATIONS]

optional arguments:
  -h, --help            show this help message and exit
  --start-url START_URL
                        URL to start at (default: https://jkodirect.jten.mil/)
  --ai-provider {claude,ollama}
                        AI provider to use (default: claude)
  --claude-api-key CLAUDE_API_KEY
                        Claude API key (or set ANTHROPIC_API_KEY env var)
  --ollama-url OLLAMA_URL
                        Ollama server URL (default: http://localhost:11434)
  --ollama-model OLLAMA_MODEL
                        Ollama model to use (default: llava)
  --headless            Run browser in headless mode (not recommended)
  --debug               Enable debug output
  --max-iterations MAX_ITERATIONS
                        Maximum iterations before stopping (default: 500)
```

## How It Works

### Phase 1: Manual Login (You Control)

1. **Browser Opens**: Script opens JKO home page
2. **You Log In**: Manually log in using your credentials
3. **Select Course**: Navigate to and open the course you want to complete
4. **Confirm**: Press Enter in the terminal to hand control to AI

### Phase 2: AI Automation (AI Controls)

1. **Screen Capture**: Takes screenshots of the current course page
2. **AI Analysis**: Sends screenshots to AI (Claude or Ollama) for analysis
3. **Decision Making**: AI determines the next action:
   - Click "Start" to begin course
   - Click "Next Page" to view more content
   - Click "Next Lesson" when ready to proceed
   - Answer multiple choice questions
   - Submit tests
4. **Action Execution**: Executes the AI's decision
5. **Repeat**: Continues until course is complete

The AI adapts to different course layouts automatically, making intelligent decisions based on visual analysis of each page.

## Screenshots

All screenshots are saved in the `screenshots/` directory for debugging and progress tracking.

## Troubleshooting

### Playwright Installation Issues

If you get playwright errors:
```bash
playwright install-deps  # Install system dependencies
playwright install chromium
```

### Ollama Connection Issues

Make sure Ollama is running:
```bash
systemctl status ollama  # Check status
ollama serve             # Start manually
```

Test Ollama:
```bash
curl http://localhost:11434/api/tags
```

### Claude API Issues

Verify your API key:
```bash
echo $ANTHROPIC_API_KEY
```

Test the API:
```bash
python -c "import anthropic; client = anthropic.Anthropic(); print('API key valid')"
```

### Course Not Progressing

- Use `--debug` flag to see detailed output
- Check screenshots in `screenshots/` directory
- Verify the course URL is correct
- Some courses may have unusual layouts - the AI should adapt, but complex cases may need manual intervention

### Permission Issues on Linux

If you get permission errors:
```bash
chmod +x jko_course_automation.py
```

## Important Notes

- **Security First**: Manual login means you never share your credentials with the script - your authentication stays secure
- **Educational Use**: This tool is intended for authorized educational purposes only
- **Rate Limiting**: The script includes delays to avoid overwhelming the JKO servers
- **Monitoring**: While the script is automated, it's recommended to monitor progress
- **Manual Intervention**: Some courses may require manual intervention for unusual layouts
- **Network Requirements**: Ensure stable internet connection for both JKO access and AI API calls
- **CAC Support**: Works with CAC (Common Access Card) authentication since you log in manually

## Architecture

```
jko_course_automation.py
├── AIProvider (base class)
│   ├── ClaudeProvider - Uses Anthropic's Claude API
│   └── OllamaProvider - Uses local Ollama server
└── JKOCourseAutomation
    ├── Browser automation (Playwright)
    ├── Screenshot capture
    ├── AI decision making
    ├── Element interaction
    └── Course navigation logic
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License

## Disclaimer

This tool is provided for educational purposes. Users are responsible for ensuring their use complies with JKO's terms of service and applicable regulations. Always verify that automated course completion is permitted before use.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review screenshots in `screenshots/` directory with `--debug` flag
3. Open an issue on GitHub with debug output and screenshots
