@echo off
setlocal
set APPDIR=C:\noir-store

echo Stopping service...
nssm stop NoirStore 2>nul
timeout /t 3 /nobreak >nul

echo Killing any node on port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do (
    taskkill /F /PID %%a 2>nul
)

echo Re-extracting app...
if exist %APPDIR% rmdir /s /q %APPDIR%
mkdir %APPDIR%
powershell -Command "Expand-Archive -Path 'C:\noir-deploy.zip' -DestinationPath '%APPDIR%' -Force"
echo Extracted.

echo Starting service...
nssm start NoirStore
timeout /t 5 /nobreak >nul
nssm status NoirStore

echo.
echo Log:
type %APPDIR%\noir.log 2>nul

echo.
echo Errors:
type %APPDIR%\noir-err.log 2>nul
