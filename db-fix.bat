@echo off
setlocal
set SETUPDIR=C:\noir-setup
set DATABASE_URL=postgresql://postgres:King9989!@@localhost:5432/noir_store

echo === Prisma DB push ===
cd /d %SETUPDIR%
set DATABASE_URL=%DATABASE_URL%
call npx prisma db push
echo DB push done.

echo.
echo === Prisma generate ===
call npx prisma generate
echo Generate done.

echo.
echo === Seed database ===
call npx tsx prisma/seed.ts
echo Seeding done.

echo.
echo === Fix NSSM service .env ===
set APPDIR=C:\noir-store
nssm stop NoirStore
timeout /t 2 /nobreak >nul
nssm start NoirStore
timeout /t 3 /nobreak >nul
nssm status NoirStore

echo.
echo Done! Check http://95.216.72.139:3001
