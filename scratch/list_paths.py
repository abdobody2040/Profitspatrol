import json, re

with open('src/features/avatar/data/avatarCatalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

paths = set(re.findall(r'"filePath":\s*"([^"]+)"', text))
for p in sorted(paths):
    print(p)
