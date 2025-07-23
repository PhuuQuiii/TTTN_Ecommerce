import random
import json
import os
import torch

from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Lấy đường dẫn tuyệt đối đến thư mục hiện tại
current_dir = os.path.dirname(os.path.abspath(__file__))

# Đọc file intents.json với đường dẫn tuyệt đối
intents_path = os.path.join(current_dir, 'intents.json')
with open(intents_path, 'r') as json_data:
    intents = json.load(json_data)

# Đọc file data.pth với đường dẫn tuyệt đối
FILE = os.path.join(current_dir, 'data.pth')
data = torch.load(FILE)

# Tải thông tin từ file data.pth
# Số lượng đặc trưng đầu vào (kích thước vector bag-of-words)
input_size = data["input_size"]
# Số lượng neuron trong lớp ẩn.
hidden_size = data["hidden_size"]
#  Số lượng nhãn (tags).
output_size = data["output_size"]
# Danh sách tất cả các từ đã được xử lý.
all_words = data['all_words']
#  Danh sách các nhãn (tags).
tags = data['tags']
# Trạng thái của mô hình đã huấn luyện.
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Sam"

def get_response(msg):
    # Chuyển đổi câu đầu vào thành vector bag-of-words
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

# Dự đoán nhãn
    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

# Kiểm tra xác suất của nhãn dự đoán
    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75: # Nếu lớn hơn 75% thì trả về câu trả lời
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    
    return "I do not understand..."


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        #  Nhận câu hỏi từ người dùng
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)