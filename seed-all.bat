@echo off
setlocal
set SETUPDIR=C:\noir-setup
set DATABASE_URL=postgresql://postgres:King9989%%21%%40@localhost:5432/noir_store

cd /d %SETUPDIR%
set DATABASE_URL=%DATABASE_URL%

echo === Running seed-stock.ts ===
call npx tsx prisma/seed-stock.ts
echo Done stock.

echo.
echo === Running seed-cartons.ts ===
call npx tsx prisma/seed-cartons.ts
echo Done cartons.

echo.
echo === Running seed-reviews.ts ===
call npx tsx prisma/seed-reviews.ts
echo Done reviews.

echo.
echo All seeds done!
