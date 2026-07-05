# InterviewAce AI - Start backend (clears port 5000 first)
$port = 5000
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
  $connections | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
  }
  Write-Host "Cleared port $port"
  Start-Sleep -Seconds 1
}

Set-Location $PSScriptRoot\..
npm run dev
