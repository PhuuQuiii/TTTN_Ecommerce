"use client";

import Hls from "hls.js";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack, IoEye } from "react-icons/io5";
import { connect } from "react-redux";
import Layout from "../../src/Components/Layout";
import { getUserInfo } from "../../utils/common";

function LiveStream({ authentication }) {
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const router = useRouter();
  const videoSrc = "http://localhost:8080/hls/test.m3u8";
  const ws = useRef(null);
  const [userName, setUserName] = useState('');
  const [viewers, setViewers] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    // Get user info from Redux token
    if (authentication.token) {
      const userInfo = getUserInfo(authentication.token);
      if (userInfo && userInfo.name) {
        setUserName(userInfo.name);
      }
    }

    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = videoSrc;
      }
    }

    ws.current = new WebSocket("ws://localhost:3001");
    // ws.current = new WebSocket("https://backend-ecommerce-theta-plum.vercel.app");
    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      // Send user info when connecting
      ws.current.send(JSON.stringify({
        type: "user_info",
        name: userName || "Anonymous",
        isHost: false
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
  }, [userName, authentication.token, shouldAutoScroll]);

  // Add scroll event listener
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.addEventListener("scroll", handleScroll);
      return () => {
        commentsRef.current.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsLoading(true);
      const comment = {
        id: comments.length + 1,
        user: {
          name: userName || "Anonymous",
          avatar:
            "https://res.cloudinary.com/df33snbqj/image/upload/v1741785111/avatar1_xpzunf.png",
          isHost: false
        },
        text: newComment.trim(),
        timestamp: "Just now",
      };
      console.log("Sending comment:", comment);
      try {
        ws.current.send(JSON.stringify({ type: "comment", comment }));
      } catch (error) {
        console.error("Error sending message:", error);
      }
      setNewComment("");
      setIsLoading(false);
      // Auto scroll when sending a new message
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <Layout title="Live Stream">
      <div className="livestream-page">
        <div className="livestream-container">
          <div className="livestream-main">
            <div className="livestream-header">
              <button onClick={() => router.back()} className="back-button">
                <IoArrowBack size={20} />
                <span>Back</span>
              </button>
              <div className="viewers">
                <IoEye size={18} />
                <span>{viewers}</span>
              </div>
            </div>
            <video
              ref={videoRef}
              controls
              playsInline
              className="livestream-video"
              poster="/images/default-image.jpg"
            />
          </div>
          <div className="comment-section">
            <div className="comment-header">
              <h3>Comments</h3>
              <span className="comment-count">{comments.length}</span>
            </div>
            <div className="comments-container" ref={commentsRef}>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    src={comment.user?.avatar || comment.avatar}
                    alt={comment.user?.name || comment.name}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-author">
                      {comment.user?.name || comment.name}
                      {comment.user?.isHost && (
                        <span className="host-badge">Chủ phòng</span>
                      )}
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    <span className="comment-timestamp">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <form onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  placeholder="Enter your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(LiveStream);
