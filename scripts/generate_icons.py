from PIL import Image
from pathlib import Path

root = Path('public/logos')
icon_path = root / 'icon-logo.png'
if not icon_path.exists():
    raise FileNotFoundError(icon_path)

img = Image.open(icon_path).convert('RGBA')

# Favicon
favicon = img.resize((64, 64), resample=Image.LANCZOS)
favicon.save('public/favicon.ico')

for size in [16, 32]:
    resized = img.resize((size, size), resample=Image.LANCZOS)
    resized.save(f'public/favicon-{size}.png')

for size, name in [(180, 'apple-touch-icon.png'), (192, 'android-chrome-192.png'), (512, 'android-chrome-512.png')]:
    resized = img.resize((size, size), resample=Image.LANCZOS)
    resized.save(f'public/{name}')

print('Generated favicon assets')
