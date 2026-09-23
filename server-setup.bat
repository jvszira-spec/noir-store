@echo off
setlocal
set PGBIN=C:\PostgreSQL\pgsql\bin
set APPDIR=C:\noir-store
set SETUPDIR=C:\noir-setup
set DBURL=postgresql://postgres:King9989!@@localhost:5432/noir_store

echo === Step 1: Create database ===
%PGBIN%\createdb.exe -U postgres noir_store 2>&1
echo (if above says "already exists" thats fine)

echo.
echo === Step 2: Extract app ===
if exist %APPDIR% rmdir /s /q %APPDIR%
mkdir %APPDIR%
powershell -Command "Expand-Archive -Path 'C:\noir-deploy.zip' -DestinationPath '%APPDIR%' -Force"
echo App extracted to %APPDIR%

echo.
echo === Step 3: Fix .env DATABASE_URL ===
powershell -Command "(Get-Content '%APPDIR%\.env') -replace 'YOUR_PG_PASSWORD','King9989!@' | Set-Content '%APPDIR%\.env'"
echo .env updated

echo.
echo === Step 4: Extract DB setup ===
if exist %SETUPDIR% rmdir /s /q %SETUPDIR%
mkdir %SETUPDIR%
powershell -Command "Expand-Archive -Path 'C:\noir-db-setup.zip' -DestinationPath '%SETUPDIR%' -Force"

echo.
echo === Step 5: npm install for DB setup ===
cd /d %SETUPDIR%
call npm install 2>&1
echo npm install done

echo.
echo === Step 6: Prisma DB push ===
set DATABASE_URL=%DBURL%
call npx prisma db push 2>&1

echo.
echo === Step 7: Seed database ===
call npx tsx prisma/seed.ts 2>&1
echo Seeding done

echo.
echo === Step 8: NSSM service ===
sc query NoirStore >nul 2>&1
if %errorlevel% equ 0 (
    nssm stop NoirStore
    nssm remove NoirStore confirm
)
nssm install NoirStore node "%APPDIR%\server.js"
nssm set NoirStore AppDirectory %APPDIR%
nssm set NoirStore AppEnvironmentExtra "PORT=3001" "NODE_ENV=production"
nssm set NoirStore AppStdout %APPDIR%\noir.log
nssm set NoirStore AppStderr %APPDIR%\noir-err.log
nssm set NoirStore Start SERVICE_AUTO_START
nssm start NoirStore
echo NSSM service NoirStore started

echo.
echo === Step 9: Firewall ===
netsh advfirewall firewall delete rule name="NoirStore" >nul 2>&1
netsh advfirewall firewall add rule name="NoirStore" dir=in action=allow protocol=TCP localport=3001

echo.
echo ================================================
echo  DONE!
echo  Store:  http://95.216.72.139:3001
echo  Admin:  http://95.216.72.139:3001/admin
echo  Login:  admin@noir-store.com / admin123
echo ================================================
