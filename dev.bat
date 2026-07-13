@echo off
cd /d "E:\pdf'ai"

echo.
echo === DI darbo gidas - stabilus serveris ===
echo.
echo Atidarykite: http://localhost:3456
echo Sustabdyti: Ctrl+C
echo Jei klaida: stop-dev.bat, tada clean-dev.bat
echo.

npm run dev

echo.
pause
