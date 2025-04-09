import numpy as np
import random
import json

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from nltk_utils import bag_of_words, tokenize, stem
from model import NeuralNet

# Đọc dữ liệu từ file intents.json
with open('intents.json', 'r') as f:
    intents = json.load(f)

# Lưu trữ tất cả các từ trong các mẫu câu.
all_words = []
#  Lưu trữ các nhãn (tags) từ file intents.json
tags = []
# Lưu trữ các cặp (pattern, tag)
xy = []
# Lặp qua từng câu trong các mẫu ý định của chúng tôi
for intent in intents['intents']:
    tag = intent['tag'] # Lấy nhãn của intent.
    # add to tag list
    tags.append(tag)
    # Tokenize (tách từ) từng mẫu câu và thêm vào danh sách all_words
    for pattern in intent['patterns']: 
        # tokenize each word in the sentence
        w = tokenize(pattern)
        # add to our words list
        all_words.extend(w)
        # Lưu cặp (pattern, tag) vào danh sách xy
        xy.append((w, tag))

# Loại bỏ các ký tự không cần thiết như ?, ., !
ignore_words = ['?', '.', '!']
# Chuyển từ về dạng gốc ("running" → "run").
all_words = [stem(w) for w in all_words if w not in ignore_words]
# Loại bỏ từ trùng lặp và sắp xếp danh sách
all_words = sorted(set(all_words))
tags = sorted(set(tags))

print(len(xy), "patterns")
print(len(tags), "tags:", tags)
print(len(all_words), "unique stemmed words:", all_words)

# Tạo dữ liệu huấn luyện
X_train = []
y_train = []
for (pattern_sentence, tag) in xy:
    # X: bag of words for each pattern_sentence
    # Chuyển mỗi câu thành vector bag-of-words dựa trên danh sách all_words
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
    # Chuyển nhãn thành chỉ số (label) để sử dụng trong CrossEntropyLoss.
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Hyper-parameters ( Định nghĩa siêu tham số )
# Số lần lặp lại trong quá trình huấn luyện
num_epochs = 2000 
# Kích thước batch ( số lượng mẫu trong mỗi lần huấn luyện )
batch_size = 8
# Tốc độ học (learning rate) cho quá trình tối ưu hóa
learning_rate = 0.001
# Số lượng đặc trưng đầu vào (kích thước vector bag-of-words)
input_size = len(X_train[0])
# Số lượng neuron trong lớp ẩn (hidden layer)
hidden_size = 8
# Số lượng nhãn (tags)
output_size = len(tags)
print(input_size, output_size)

# Lớp Dataset để tạo ra các mẫu dữ liệu cho quá trình huấn luyện
class ChatDataset(Dataset):

    def __init__(self):
        self.n_samples = len(X_train) # Số lượng mẫu dữ liệu
        self.x_data = X_train # Dữ liệu đầu vào (vector bag-of-words)
        self.y_data = y_train # Nhãn tương ứng (chỉ số của tags)

    # Truy cập một mẫu dữ liệu cụ thể
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # Trả về tổng số lượng mẫu dữ liệu
    def __len__(self):
        return self.n_samples

# Tạo DataLoader để chia dữ liệu thành các batch và hỗ trợ shuffle
dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)

# Khởi tạo mô hình
# Sử dụng GPU nếu có, ngược lại dùng CPU.
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Khởi tạo mô hình NeuralNet với kích thước đầu vào, ẩn và đầu ra đã xác định trước
model = NeuralNet(input_size, hidden_size, output_size).to(device)

# Loss and optimizer
# Hàm mất mát cho bài toán phân loại.
criterion = nn.CrossEntropyLoss()
# Bộ tối ưu hóa
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Train the model
for epoch in range(num_epochs):
    # Lấy batch dữ liệu từ DataLoader.
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        # Dự đoán của mô hình ( logits (giá trị chưa qua softmax), đại diện cho xác suất của từng lớp)
        outputs = model(words)
        # if y would be one-hot, we must apply
        # labels = torch.max(labels, 1)[1]
        # Tính toán hàm mất mát giữa đầu ra của mô hình và nhãn thực tế
        loss = criterion(outputs, labels)
        # labels là nhãn thực tế, outputs là đầu ra của mô hình
        
        # Tối ưu hóa mô hình
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print (f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')


print(f'final loss: {loss.item():.4f}')

# Lưu trạng thái mô hình và các thông tin cần thiết vào file data.pth
data = {
"model_state": model.state_dict(),
"input_size": input_size,
"hidden_size": hidden_size,
"output_size": output_size,
"all_words": all_words,
"tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)

print(f'training complete. file saved to {FILE}')

# File này chứa mã để huấn luyện mô hình học máy cho chatbot. Nó đọc dữ liệu từ file intents.json, xử lý dữ liệu, tạo ra các cặp câu hỏi và nhãn, và sau đó huấn luyện mô hình neural network. Nó cũng lưu trữ trạng thái của mô hình sau khi huấn luyện.

# Đọc và xử lý dữ liệu từ intents.json.
# Tạo vector bag-of-words và nhãn.
# Định nghĩa mô hình neural network.
# Huấn luyện mô hình với PyTorch.
# Lưu trạng thái mô hình sau khi huấn luyện.