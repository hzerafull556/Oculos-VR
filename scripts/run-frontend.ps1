$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$frontendPath = Join-Path $projectRoot 'Oculos VR frontend web'

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm nao encontrado. Instale o Node.js antes de continuar.'
}

Push-Location $frontendPath
try {
  # O Vite fica em modo desenvolvimento ate voce encerrar o processo.
  npm run dev
}
finally {
  Pop-Location
}
