@echo off
echo Khoi dong Chatbot va Web Client...

:: Khoi dong Chatbot trong terminal rieng
start cmd /k "cd chatbot-deployment && python app.py"

:: Doi 5 giay cho server chatbot khoi dong
timeout /t 5

:: Khoi dong Next.js client
start cmd /k "cd client && npm run dev"

echo Ung dung da duoc khoi dong!
echo Chatbot API: http://127.0.0.1:5000
echo Web Client: http://localhost:3002 