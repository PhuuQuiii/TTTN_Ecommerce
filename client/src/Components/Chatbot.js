import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = { text: inputMessage.trim(), sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await axios.post("/api/chatbot", {
        message: userMessage.text,
      });

      // Thêm câu trả lời từ chatbot vào danh sách
      const botMessage = { text: response.data.answer, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3 style={{ color: "white" }}>Chat support</h3>
            <button onClick={toggleChat} className="close-button">
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hi. My name is Qui. How can I help you?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-icon">
                    {message.sender === "bot" ? <FaRobot /> : null}
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message bot">
                <div className="message-icon">
                  <FaRobot />
                </div>
                <div className="message-text typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Write a message..."
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      ) : (
        <button onClick={toggleChat} className="chatbot-button">
          <FaRobot />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
