@echo off
cd /d "E:\pdf'ai"

echo.
echo === Valomas cache ir paleidziamas serveris ===
echo.

node scripts\kill-all-dev.mjs
timeout /t 2 /nobreak >nul

if exist "E:\pdf'ai\.next" (
  echo Valomas .next cache...
  rmdir /s /q "E:\pdf'ai\.next"
)

echo.
echo Paleidziama: http://localhost:3456
echo.

npm run dev

echo.
pause