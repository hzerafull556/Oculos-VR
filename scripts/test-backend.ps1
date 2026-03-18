$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$backendPath = Join-Path $projectRoot 'Oculos VR backend'
$pythonExe = Join-Path $backendPath '.venv\Scripts\python.exe'

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

# Mantemos um unico ambiente local para reduzir duplicacao e ambiguidade.
if (-not (Test-PythonModule -PythonExe $pythonExe -ModuleName 'pytest')) {
  throw 'Nenhuma .venv valida com pytest foi encontrada. Rode .\scripts\install-backend.ps1 primeiro.'
}

Push-Location $backendPath
try {
  & $pythonExe -m pytest -q
}
finally {
  Pop-Location
}
