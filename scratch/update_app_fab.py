with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = "const OllieChat = React.lazy(() => import('../features/game/components/OllieChat'));"
replacement1 = target1 + "\nconst PlayHubFAB = React.lazy(() => import('../components/ui/PlayHubFAB'));"

target2 = "{user && <OllieChat />}"
replacement2 = """{user && (
                    <>
                        <PlayHubFAB />
                        <OllieChat />
                    </>
                )}"""

if target1 in content and target2 in content:
    content = content.replace(target1, replacement1, 1)
    content = content.replace(target2, replacement2, 1)
    with open('src/app/App.tsx', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print("SUCCESS: App.tsx updated")
else:
    print("FAILED: targets not found", target1 in content, target2 in content)
