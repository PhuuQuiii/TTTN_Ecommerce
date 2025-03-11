import Hls from 'hls.js';
import React, { useEffect, useState } from 'react';

const LayoutLiveStream = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg'
      },
      text: 'Great stream!'
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        avatar: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg'
      },
      text: 'The quality is amazing!'
    }
  ]);
  const [newComment, setNewComment] = useState('');

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
  }, []);

  const handleSendComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          user: {
            name: 'Current User',
            avatar: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg'
          },
          text: newComment
        }
      ]);
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
      </div>
      <div className="live-stream-main">
        <div className="live-stream-content">
          <video id="video" controls></video>
          <div className="live-stream-info">
            <div className="viewer-count">
              <i className="fas fa-eye"></i>
              <span>1.2M</span>
            </div>
          </div>
        </div>

        <div className="live-stream-comments">
          <div className="comments-header">
            <h3>Live Chat</h3>
          </div>
          
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  <img src={comment.user.avatar} alt={comment.user.name} />
                </div>
                <div className="comment-content">
                  <div className="comment-author">{comment.user.name}</div>
                  <div className="comment-text">{comment.text}</div>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
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