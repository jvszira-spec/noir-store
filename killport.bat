@echo off
echo Killing process on port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do (
    echo Killing PID %%a
    taskkill /F /PID %%a 2>nul
)
echo Done killing.

echo Stopping NSSM service...
nssm stop NoirStore 2>nul
timeout /t 2 /nobreak >nul

echo Starting NSSM service...
nssm start NoirStore
timeout /t 4 /nobreak >nul
nssm status NoirStore

echo.
echo Log output:
type C:\noir-store\noir.log 2>nul
echo.
echo Error log:
type C:\noir-store\noir-err.log 2>nul
