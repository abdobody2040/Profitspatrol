$filePath = "g:\Vibe coding\Profitspatrol\src\features\hq\components\KidMap.tsx"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# The HUD block starts with this comment and ends just before the district header card comment
# We need to:
# 1. Cut the entire HUD block from inside the max-w-2xl container
# 2. Move it to be a direct child of the root div (before the max-w-2xl container)

# Change: make the sticky HUD use fixed positioning to escape its container
$content = $content.Replace(
    '<div className="sticky top-16 md:top-0 z-40 w-full">',
    '<div className="fixed top-16 md:top-0 z-40 w-full left-0 right-0">'
)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - HUD now uses fixed positioning for full-width"
