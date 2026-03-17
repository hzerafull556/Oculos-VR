$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$frontendPath = Join-Path $projectRoot 'Oculos VR frontend web'

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm nao encontrado. Instale o Node.js antes de continuar.'
}

Push-Location $frontendPath
try {
  # Instalacao simples das dependencias do frontend.
  npm install
}
finally {
  Pop-Location
}
