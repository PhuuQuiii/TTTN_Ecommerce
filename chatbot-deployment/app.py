from flask import Flask, render_template, request, jsonify
import json
from flask_cors import CORS
from chat import get_response
import traceback

app = Flask(__name__)

# Cấu hình CORS - cho phép client truy cập
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3002", 
    "http://127.0.0.1:3002", 
    "http://client:3002"
]}})

# Thêm route cho trang chính
@app.route("/")
def home():
    return render_template("base.html")  # Đảm bảo rằng bạn có file base.html trong thư mục templates

@app.post("/predict")
def predict():
    try:
        if not request.json or not "message" in request.json:
            return jsonify({"answer": "Không nhận được tin nhắn hợp lệ"}), 400
        
        text = request.json.get("message")
        if not text or not isinstance(text, str):
            return jsonify({"answer": "Tin nhắn không hợp lệ"}), 400
        
        # Xử lý phản hồi từ chatbot
        response = get_response(text)
        message = {"answer": response}
        return jsonify(message)
    except Exception as e:
        print(f"Lỗi: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"answer": "Xin lỗi, đã xảy ra lỗi trong quá trình xử lý tin nhắn của bạn."}), 500

if __name__=="__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)