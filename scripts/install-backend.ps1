$ErrorActionPreference = 'Stop'

# Resolve a pasta do backend mesmo quando o script e executado de outro lugar.
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$backendPath = Join-Path $projectRoot 'Oculos VR backend'
$venvPath = Join-Path $backendPath '.venv'
$pythonExe = Join-Path $venvPath 'Scripts\python.exe'

Push-Location $backendPath
try {
  # Criamos uma .venv local se ela ainda nao existir.
  if (-not (Test-Path $pythonExe)) {
    if (Get-Command py -ErrorAction SilentlyContinue) {
      & py -3 -m venv $venvPath
    }
    elseif (Get-Command python -ErrorAction SilentlyContinue) {
      & python -m venv $venvPath
    }
    else {
      throw 'Python nao encontrado. Instale o Python 3 antes de continuar.'
    }
  }

  & $pythonExe -m pip install --upgrade pip
  & $pythonExe -m pip install -r requirements.txt
}
finally {
  Pop-Location
}
