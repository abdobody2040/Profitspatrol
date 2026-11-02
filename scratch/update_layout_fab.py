with open('src/components/layout/Layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        {(isKid || isAdmin) && (
          <PlayHubFAB features={playHubFeatures} spinReady={spinReady} />
        )}"""

if target in content:
    content = content.replace(target, "", 1)
    with open('src/components/layout/Layout.tsx', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print("SUCCESS: Layout.tsx updated")
else:
    print("FAILED: target not found in Layout.tsx")
