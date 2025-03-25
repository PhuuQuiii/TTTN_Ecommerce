import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./LiveStream.scss";

const LayoutLiveStream = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [viewers, setViewers] = useState(0);
  const commentsRef = useRef(null);
  const ws = useRef(null);
  const { authUser } = useSelector((state) => state.auth);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    if (commentsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = commentsRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    const video = document.getElementById("video");
    const videoSrc = "http://localhost:8080/hls/test.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }

    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      // Send admin info when connecting
      ws.current.send(JSON.stringify({
        type: "user_info",
        name: authUser?.name || "Admin",
        isHost: true,
        role: authUser?.role || "admin"
      }));
    };
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        if (message.type === "comment") {
          setComments((prevComments) => [...prevComments, message.comment]);
          // Auto scroll when new message arrives if shouldAutoScroll is true
          if (shouldAutoScroll) {
            setTimeout(scrollToBottom, 100);
          }
        } else if (message.type === "viewers") {
          setViewers(message.count);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };
    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error", error);
    };

    return () => {
      ws.current.close();
    };
  }, [authUser, shouldAutoScroll]);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.addEventListener("scroll", handleScroll);
      return () => {
        commentsRef.current.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: {
          name: authUser?.name || "Admin",
          avatar: "https://res.cloudinary.com/df33snbqj/image/upload/v1741785111/avatar1_xpzunf.png",
          isHost: true,
          role: authUser?.role || "admin"
        },
        text: newComment.trim(),
        timestamp: "Just now",
      };
      ws.current.send(JSON.stringify({ type: "comment", comment }));
      setNewComment("");
      // Auto scroll when sending a new message
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="live-stream-container">
      <div className="live-stream-header">
        <h2>Live Stream</h2>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
        <div className="viewer-count">
          <i className="fas fa-eye"></i>
          <span>{viewers}</span>
        </div>
      </div>
      <div className="live-stream-main">
        <div className="live-stream-content">
          <video id="video" controls></video>
        </div>
        <div className="live-stream-comments">
          <div className="comments-header">
            <h3>Live Chat</h3>
          </div>
          <div className="comments-list" ref={commentsRef}>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  <img
                    src={comment.user?.avatar || comment.avatar}
                    alt={comment.user?.name || comment.name}
                  />
                </div>
                <div className="comment-content">
                  <div className="comment-author">
                    <span className="comment-name">{comment.user?.name || comment.name}</span>
                    {comment.user?.isHost && (
                      <span className="host-badge">Chủ Phòng</span>
                    )}
                  </div>
                  <div className="comment-text">{comment.text}</div>
                  {comment.timestamp && (
                    <div className="comment-timestamp">{comment.timestamp}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="comments-input">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Type a message..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              />
              <button onClick={handleSendComment}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutLiveStream;
