#!/usr/bin/env python3
"""
Simple icon generator for JKO Automation Chrome Extension
Requires: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Pillow library not found")
    print("Install with: pip install Pillow")
    exit(1)

import os

def create_icon(size):
    """Create a simple JKO icon with the specified size"""
    # Create image with green background
    img = Image.new('RGB', (size, size), color='#4CAF50')
    draw = ImageDraw.Draw(img)

    # Draw border
    border_width = max(1, size // 16)
    draw.rectangle(
        [(0, 0), (size - 1, size - 1)],
        outline='#1B5E20',
        width=border_width
    )

    # Draw text "JKO"
    try:
        # Try to use a nice font if available
        font_size = size // 3
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    text = "JKO"

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((size - text_width) // 2, (size - text_height) // 2 - 2)

    # Draw text
    draw.text(position, text, fill='white', font=font)

    return img

def main():
    # Create icons directory if it doesn't exist
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    # Generate icons
    sizes = [16, 48, 128]

    for size in sizes:
        print(f"Generating {size}x{size} icon...")
        icon = create_icon(size)
        icon_path = os.path.join(icons_dir, f'icon{size}.png')
        icon.save(icon_path, 'PNG')
        print(f"  Saved to {icon_path}")

    print("\n✅ All icons generated successfully!")
    print("You can now install the Chrome extension.")

if __name__ == '__main__':
    main()
