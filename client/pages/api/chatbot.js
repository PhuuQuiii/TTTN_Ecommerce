// API endpoint để kết nối với chatbot
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Chỉ chấp nhận phương thức POST" });
  }

  try {
    const { message } = req.body;

    // Gọi API của chatbot sử dụng 127.0.0.1 thay vì localhost
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      message: message,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Lỗi khi gọi chatbot API:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi xử lý yêu cầu chatbot", error: error.message });
  }
}
