import torch
import torch.nn as nn

# Định nghĩa một mạng neural tùy chỉnh.
class NeuralNet(nn.Module):
# input_size: Số lượng đặc trưng đầu vào (kích thước vector bag-of-words).
# hidden_size: Số lượng neuron trong lớp ẩn.
# num_classes: Số lượng nhãn (tags) đầu ra.
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        # Lớp fully connected đầu tiên (kết nối từ input_size đến hidden_size).
        self.l1 = nn.Linear(input_size, hidden_size) 
        # Lớp fully connected thứ hai (kết nối từ hidden_size đến hidden_size).
        self.l2 = nn.Linear(hidden_size, hidden_size) 
        # Lớp fully connected cuối cùng (kết nối từ hidden_size đến num_classes).
        self.l3 = nn.Linear(hidden_size, num_classes)
        # Hàm kích hoạt ReLU (Rectified Linear Unit), được sử dụng để thêm tính phi tuyến vào mạng.
        self.relu = nn.ReLU()
    
    # Định nghĩa cách dữ liệu đầu vào (x) được truyền qua các lớp của mạng neural.
    def forward(self, x):
        #  Dữ liệu đầu vào (x) được truyền qua lớp fully connected đầu tiên.
        out = self.l1(x)
        # Áp dụng hàm kích hoạt ReLU lên đầu ra của lớp l1
        out = self.relu(out)
        # Đầu ra từ lớp trước được truyền qua lớp fully connected thứ hai.
        out = self.l2(out)
        # Áp dụng ReLU lên đầu ra của lớp l2.
        out = self.relu(out)
        #  Đầu ra từ lớp trước được truyền qua lớp fully connected cuối cùng.
        out = self.l3(out)
        # no activation and no softmax at the end
        return out5
    
    
# Mục đích của lớp NeuralNet:

# Đây là một mạng neural đơn giản với:
# 1 lớp đầu vào (input_size).
# 2 lớp ẩn (hidden_size).
# 1 lớp đầu ra (num_classes).
# Sử dụng hàm kích hoạt ReLU để thêm tính phi tuyến.
# Không áp dụng softmax ở lớp cuối vì hàm mất mát đã xử lý điều này.
# Luồng dữ liệu:

# Dữ liệu đầu vào → Lớp fully connected → ReLU → Lớp fully connected → ReLU → Lớp fully connected → Đầu ra.