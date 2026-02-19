$f = "c:\Users\T\.gemini\antigravity\playground\sparse-kuiper\resources\your-wellness.html"
$lines = Get-Content $f -Encoding UTF8
# Keep lines 1-731 (index 0-730) and lines 1407+ (index 1406+)
$kept = $lines[0..730] + $lines[1406..($lines.Length-1)]
$kept | Set-Content $f -Encoding UTF8
Write-Host "Done. Kept $($kept.Length) lines from $($lines.Length) original lines."
