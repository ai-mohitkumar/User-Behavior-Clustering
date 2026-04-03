@echo off
call venv\Scripts\activate.bat
python -W ignore::DeprecationWarning main.py
pause

