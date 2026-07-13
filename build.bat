@echo off
subst X: "E:\pdf'ai" 2>nul
X:
cd \
npm install
npm run build
