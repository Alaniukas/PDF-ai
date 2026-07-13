Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot "..\public\images\pdf-preview"
$cover = [System.Drawing.Image]::FromFile((Join-Path $dir "page-cover.png"))
$steps = [System.Drawing.Image]::FromFile((Join-Path $dir "page-steps.png"))
$pad = 24
$gap = 16
$targetH = 520
$scale1 = $targetH / $cover.Height
$scale2 = $targetH / $steps.Height
$w1 = [int]($cover.Width * $scale1)
$w2 = [int]($steps.Width * $scale2)
$totalW = $pad * 2 + $w1 + $gap + $w2
$totalH = $pad * 2 + $targetH
$bmp = New-Object System.Drawing.Bitmap($totalW, $totalH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(255, 250, 248, 245))
$g.DrawImage($cover, $pad, $pad, $w1, $targetH)
$g.DrawImage($steps, $pad + $w1 + $gap, $pad, $w2, $targetH)
$out = Join-Path $dir "sample-preview.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$cover.Dispose()
$steps.Dispose()
$g.Dispose()
$bmp.Dispose()
Write-Output "Saved $out ($totalW x $totalH)"
