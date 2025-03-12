import React, { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';

const LayoutLiveStream = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [viewers, setViewers] = useState(0);
  const commentsRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    const video = document.getElementById('video');
    const videoSrc = "http://localhost:8080/hls/test.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }

    ws.current = new WebSocket('ws://localhost:8000');
    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        if (message.type === 'comment') {
          setComments((prevComments) => [...prevComments, message.comment]);
        } else if (message.type === 'viewers') {
          setViewers(message.count);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.log('WebSocket error', error);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: {
          name: 'Shop test',
          avatar: '../../../../public/img/avatar1.png'
        },
        text: newComment
      };
      console.log('Sending comment:', comment);
      ws.current.send(JSON.stringify({ type: 'comment', comment }));
      setNewComment('');
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
                {comment.user && (
                  <>
                    <div className="comment-avatar">
                      <img src={comment.user.avatar} alt={comment.user.name} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-author">{comment.user.name}</div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  </>
                )}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
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