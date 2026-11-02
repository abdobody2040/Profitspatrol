import json
import re

with open('src/features/avatar/data/avatarCatalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# AVATAR_CATALOG is exported as a JS array. Let's find each item block.
# Simple regex to extract JSON-like objects
pattern = re.compile(r'\{\s*"id":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)"[\s\S]*?\}', re.MULTILINE)

# Alternatively, find all objects with id, name, nameAr, category, filePath, thumbnailPath
item_pattern = re.compile(r'\{\s*"id":\s*"(?P<id>[^"]+)",\s*"name":\s*"(?P<name>[^"]+)",\s*"nameAr":\s*"(?P<nameAr>[^"]+)",\s*"category":\s*"(?P<category>[^"]+)"', re.MULTILINE)

items_by_cat = {}
for m in item_pattern.finditer(text):
    cat = m.group('category')
    items_by_cat.setdefault(cat, []).append((m.group('id'), m.group('name'), m.group('nameAr')))

for cat, items in items_by_cat.items():
    print(f'=== Category: {cat} ({len(items)} items) ===')
    for item_id, name, name_ar in items:
        print(f'  {item_id:35s} | {name:30s} | {name_ar}')
