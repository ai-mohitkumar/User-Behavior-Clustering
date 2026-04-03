@echo off
call venv\Scripts\activate.bat
echo 1. Pipeline: python main.py
echo 2. Dashboard: streamlit run dashboard.py
set /p choice="Choose (1 or 2): "
if "%choice%"=="1" python main.py
if "%choice%"=="2" streamlit run dashboard.py
pause
