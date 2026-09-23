@echo off
setlocal
set SETUPDIR=C:\noir-setup
set APPDIR=C:\noir-store
set DATABASE_URL=postgresql://postgres:King9989%%21%%40@localhost:5432/noir_store

echo === Re-extract app (updated .env) ===
nssm stop NoirStore >nul 2>&1
timeout /t 2 /nobreak >nul
if exist %APPDIR% rmdir /s /q %APPDIR%
mkdir %APPDIR%
powershell -Command "Expand-Archive -Path 'C:\noir-deploy.zip' -DestinationPath '%APPDIR%' -Force"
echo App re-extracted

echo.
echo === Re-extract DB setup ===
if exist %SETUPDIR% rmdir /s /q %SETUPDIR%
mkdir %SETUPDIR%
powershell -Command "Expand-Archive -Path 'C:\noir-db-setup.zip' -DestinationPath '%SETUPDIR%' -Force"
cd /d %SETUPDIR%

echo.
echo === npm install ===
call npm install 2>&1
echo Done

echo.
echo === Prisma DB push ===
call npx prisma db push
echo DB push done

echo.
echo === Prisma generate ===
call npx prisma generate
echo Generate done

echo.
echo === Seed database ===
call npx tsx prisma/seed.ts
echo Seeding done

echo.
echo === Restart NSSM service ===
nssm stop NoirStore >nul 2>&1
timeout /t 2 /nobreak >nul
nssm start NoirStore
timeout /t 4 /nobreak >nul
nssm status NoirStore

echo.
echo === Check log ===
if exist %APPDIR%\noir.log (
    type %APPDIR%\noir.log
) else (
    echo No log yet
)

echo.
echo Done! http://95.216.72.139:3001
