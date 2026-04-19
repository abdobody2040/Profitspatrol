$filePath = 'g:\Vibe coding\Profitspatrol\src\locales\ar.ts'
$lines = Get-Content $filePath
# Keep lines 1-6651 (0-indexed: 0-6650) and 11830+ (0-indexed: 11829+)
$newLines = $lines[0..6650] + $lines[11829..($lines.Length - 1)]
[System.IO.File]::WriteAllLines($filePath, $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Done. New line count: $($newLines.Length)"
