$filePath = "g:\Vibe coding\Profitspatrol\src\features\hq\components\KidMap.tsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Revert fixed -> sticky (remove left-0 right-0)
$content = $content.Replace(
    '<div className="fixed top-16 md:top-0 z-40 w-full left-0 right-0">',
    '<div className="sticky top-16 md:top-0 z-40 w-full">'
)

# 2. Change the outer root div: overflow-hidden -> overflow-x-hidden (so sticky works)
$content = $content.Replace(
    'relative pb-32 overflow-hidden w-full min-h-screen',
    'relative pb-32 overflow-x-hidden w-full min-h-screen'
)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Step 1 done"
