# Quick Start Guide

Get up and running with JKO Course Automation in 5 minutes!

## Option 1: Quick Setup (Recommended)

```bash
# Run the automated setup script
./setup.sh

# Activate virtual environment
source venv/bin/activate

# Set your Claude API key
export ANTHROPIC_API_KEY='your-api-key-here'

# Run the automation
python jko_course_automation.py

# Browser opens -> Log in -> Click on course -> Press Enter -> AI does the rest!
```

## Option 2: Manual Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Set API key
export ANTHROPIC_API_KEY='your-api-key-here'

# Run
python jko_course_automation.py
```

## Option 3: Using Ollama (Free, Local)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download vision model
ollama pull llava

# Start Ollama (in a separate terminal)
ollama serve

# Run the automation with Ollama
python jko_course_automation.py --ai-provider ollama
```

## The Workflow

1. **Run the script**: `python jko_course_automation.py`
2. **Browser opens** at jkodirect.jten.mil
3. **You log in** using your normal credentials (CAC, username/password, etc.)
4. **Navigate to a course** by clicking on it
5. **Press Enter** in the terminal when you're on the course page
6. **AI takes over** and completes the entire course automatically!

No need to copy/paste course URLs - just run the script and log in normally!

## First Run Example

```bash
# With debug output (recommended for first time)
python jko_course_automation.py --debug

# 1. Browser window opens
# 2. Log in to JKO manually
# 3. Click on the course you want
# 4. Terminal shows: "Press Enter when ready..."
# 5. Press Enter
# 6. Watch as the AI navigates through the course!
# Screenshots will be saved to screenshots/ folder
```

## Common Issues

### "playwright not found"
```bash
pip install playwright
playwright install chromium
```

### "ANTHROPIC_API_KEY not set"
```bash
export ANTHROPIC_API_KEY='your-key-here'
# Or use --claude-api-key flag
```

### "Connection refused" (Ollama)
```bash
# Make sure Ollama is running
ollama serve
```

## Tips

- Use `--debug` flag to see what's happening
- Use `--headless` for background operation
- Check `screenshots/` folder if something goes wrong
- Start with a short test course first

## Need Help?

See the full [README.md](README.md) for detailed documentation.
