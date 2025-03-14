#!/bin/bash
echo "Khởi động Chatbot và Web Client..."

# Khởi động Chatbot trong terminal riêng
gnome-terminal -- bash -c "cd chatbot-deployment && python app.py; bash" || \
xterm -e "cd chatbot-deployment && python app.py; bash" || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/chatbot-deployment && python app.py"'

# Đợi 5 giây cho server chatbot khởi động
echo "Đợi server chatbot khởi động..."
sleep 5

# Khởi động Next.js client
gnome-terminal -- bash -c "cd client && npm run dev; bash" || \
xterm -e "cd client && npm run dev; bash" || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/client && npm run dev"'

echo "Ứng dụng đã được khởi động!"
echo "Chatbot API: http://127.0.0.1:5000"
echo "Web Client: http://localhost:3002" 