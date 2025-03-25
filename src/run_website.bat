@echo off
echo Starting Object Detection Application...

:: Start the Flask backend server
start cmd /k "echo Starting Flask server... && python app.py"

:: Wait a moment for the server to initialize
timeout /t 3 /nobreak > nul

:: Start the frontend (assuming it's a Next.js app)
:: Change the directory path to your frontend location
start cmd /k "echo Starting frontend...  && npm run dev"

echo Both applications are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000