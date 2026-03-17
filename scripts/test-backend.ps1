$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$backendPath = Join-Path $projectRoot 'Oculos VR backend'
$preferredPython = Join-Path $backendPath '.venv\Scripts\python.exe'
$legacyPython = Join-Path $backendPath 'venv\Scripts\python.exe'

function Test-PythonModule {
  param(
    [string]$PythonExe,
    [string]$ModuleName
  )

  if (-not (Test-Path $PythonExe)) {
    return $false
  }

  $stdoutFile = [System.IO.Path]::GetTempFileName()
  $stderrFile = [System.IO.Path]::GetTempFileName()

  try {
    $process = Start-Process `
      -FilePath $PythonExe `
      -ArgumentList "-c ""import $ModuleName""" `
      -Wait `
      -PassThru `
      -NoNewWindow `
      -RedirectStandardOutput $stdoutFile `
      -RedirectStandardError $stderrFile

    return ($process.ExitCode -eq 0)
  }
  finally {
    Remove-Item $stdoutFile, $stderrFile -ErrorAction SilentlyContinue
  }
}

# O teste tenta usar .venv primeiro, mas cai para o venv legado se ele for o ambiente valido.
if (Test-PythonModule -PythonExe $preferredPython -ModuleName 'pytest') {
  $pythonExe = $preferredPython
}
elseif (Test-PythonModule -PythonExe $legacyPython -ModuleName 'pytest') {
  $pythonExe = $legacyPython
}
else {
  throw 'Nenhum ambiente com pytest foi encontrado. Rode .\scripts\install-backend.ps1 primeiro.'
}

Push-Location $backendPath
try {
  & $pythonExe -m pytest -q
}
finally {
  Pop-Location
}
