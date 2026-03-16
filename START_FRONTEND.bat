@echo off
echo ========================================
echo   RAG Chat Frontend - React
echo ========================================
echo.

REM Verificar si node_modules existe
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando servidor de desarrollo...
echo Frontend disponible en: http://localhost:3000
echo.
call npm run dev

pause
