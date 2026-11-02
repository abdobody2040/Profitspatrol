param(
    [string]$InputPath,
    [string]$OutputPath,
    [int]$Threshold = 240
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile($InputPath)
$width = $src.Width
$height = $src.Height

# Create ARGB bitmap
$dst = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($dst)
$graphics.DrawImage($src, 0, 0, $width, $height)
$graphics.Dispose()
$src.Dispose()

# Lock bits for high-speed memory manipulation
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bmpData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $bmpData.Stride
$bytesTotal = [Math]::Abs($stride) * $height
$bytes = New-Object byte[] $bytesTotal
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $bytesTotal)

# BFS flood-fill from all 4 borders to remove connected white background
$visited = New-Object bool[] ($width * $height)
$queue = New-Object System.Collections.Generic.Queue[int]

# Enqueue border pixels that are near white
for ($x = 0; $x -lt $width; $x++) {
    # Top border (y = 0)
    $idxTop = $x * 4
    if ($bytes[$idxTop] -ge $Threshold -and $bytes[$idxTop + 1] -ge $Threshold -and $bytes[$idxTop + 2] -ge $Threshold) {
        $queue.Enqueue($x)
        $visited[$x] = $true
    }
    # Bottom border (y = height - 1)
    $idxBottom = (($height - 1) * $stride) + ($x * 4)
    $linearBottom = (($height - 1) * $width) + $x
    if ($bytes[$idxBottom] -ge $Threshold -and $bytes[$idxBottom + 1] -ge $Threshold -and $bytes[$idxBottom + 2] -ge $Threshold) {
        $queue.Enqueue($linearBottom)
        $visited[$linearBottom] = $true
    }
}

for ($y = 0; $y -lt $height; $y++) {
    # Left border (x = 0)
    $idxLeft = $y * $stride
    $linearLeft = $y * $width
    if (-not $visited[$linearLeft] -and $bytes[$idxLeft] -ge $Threshold -and $bytes[$idxLeft + 1] -ge $Threshold -and $bytes[$idxLeft + 2] -ge $Threshold) {
        $queue.Enqueue($linearLeft)
        $visited[$linearLeft] = $true
    }
    # Right border (x = width - 1)
    $idxRight = ($y * $stride) + (($width - 1) * 4)
    $linearRight = ($y * $width) + ($width - 1)
    if (-not $visited[$linearRight] -and $bytes[$idxRight] -ge $Threshold -and $bytes[$idxRight + 1] -ge $Threshold -and $bytes[$idxRight + 2] -ge $Threshold) {
        $queue.Enqueue($linearRight)
        $visited[$linearRight] = $true
    }
}

# Flood fill
while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $width
    $cy = [Math]::Floor($curr / $width)

    $byteIdx = ($cy * $stride) + ($cx * 4)
    # Set Alpha to 0
    $bytes[$byteIdx + 3] = 0

    # 4-neighbors
    $neighbors = @(
        [tuple]::Create($cx - 1, $cy),
        [tuple]::Create($cx + 1, $cy),
        [tuple]::Create($cx, $cy - 1),
        [tuple]::Create($cx, $cy + 1)
    )

    foreach ($n in $neighbors) {
        $nx = $n.Item1
        $ny = $n.Item2
        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            $nLinear = ($ny * $width) + $nx
            if (-not $visited[$nLinear]) {
                $nByteIdx = ($ny * $stride) + ($nx * 4)
                # B, G, R
                $b = $bytes[$nByteIdx]
                $g = $bytes[$nByteIdx + 1]
                $r = $bytes[$nByteIdx + 2]
                if ($r -ge $Threshold -and $g -ge $Threshold -and $b -ge $Threshold) {
                    $visited[$nLinear] = $true
                    $queue.Enqueue($nLinear)
                } elseif ($r -ge ($Threshold - 25) -and $g -ge ($Threshold - 25) -and $b -ge ($Threshold - 25)) {
                    # Semi-transparent border feathering
                    $visited[$nLinear] = $true
                    $avg = ($r + $g + $b) / 3.0
                    $alpha = [byte][Math]::Max(0, [Math]::Min(255, (255 - ($avg - ($Threshold - 25)) * 10)))
                    $bytes[$nByteIdx + 3] = $alpha
                }
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytesTotal)
$dst.UnlockBits($bmpData)

# Save as PNG
$dst.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dst.Dispose()

Write-Host "Saved transparent PNG to $OutputPath"
