
@echo off
echo ==========================================
echo 🚀 Iniciando o sistema AP1_Loja...
echo ==========================================

REM --- Inicia o back-end Flask ---
echo Iniciando o servidor Flask...
cd loja_api_fixed
start cmd /k "call venv\Scripts\activate && python app.py"
cd ..

REM --- Inicia o front-end Next.js ---
echo Iniciando o servidor Next.js...
cd frontend-nextjs
start cmd /k "npm run dev"
cd ..

echo ==========================================
echo ✅ Ambos os servidores foram iniciados!
echo ==========================================
pause
