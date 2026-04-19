$filePath = 'g:\Vibe coding\Profitspatrol\src\locales\en.ts'
$lines = Get-Content $filePath
# Keep lines 1-1994 (0-indexed: 0-1993) and 3691+ (0-indexed: 3690+)
$newLines = $lines[0..1993] + $lines[3690..($lines.Length - 1)]
$newLines | Set-Content $filePath -Encoding UTF8
Write-Host "Done. New line count: $($newLines.Length)"
