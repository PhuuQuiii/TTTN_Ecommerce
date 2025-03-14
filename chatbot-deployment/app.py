from flask import Flask, render_template, request, jsonify
import json
from flask_cors import CORS
from chat import get_response

app = Flask(__name__)

CORS(app)

# Thêm route cho trang chính
@app.route("/")
def home():
    return render_template("base.html")  # Đảm bảo rằng bạn có file base.html trong thư mục templates

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    # Check if JSON is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__=="__main__":
    app.run(debug=True)