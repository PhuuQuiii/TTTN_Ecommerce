'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { IoArrowBack, IoEllipsisVertical, IoEye, IoHeart, IoSend, IoShare } from 'react-icons/io5';
import Layout from '../../src/Components/Layout';
import { useRouter } from 'next/router';

export default function LiveStream() {
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const router = useRouter();
  const videoSrc = 'http://localhost:8080/hls/test.m3u8';
  const ws = useRef(null);

  const [viewers, setViewers] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsLoading(true);
      const comment = {
        id: comments.length + 1,
        name: 'You',
        avatar: '/images/default-image.jpg',
        text: newComment.trim(),
        timestamp: 'Just now'
      };
      console.log('Sending comment:', comment);
      ws.current.send(JSON.stringify({ type: 'comment', comment }));
      setNewComment('');
      setIsLoading(false);
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
            <video ref={videoRef} controls playsInline className="livestream-video" poster="/images/default-image.jpg" />
          </div>
          <div className="comment-section">
            <div className="comment-header">
              <h3>Comments</h3>
              <span className="comment-count">{comments.length}</span>
            </div>
            <div className="comments-container" ref={commentsRef}>
              {comments.map((cmt) => (
                <div key={cmt.id} className="comment">
                  <img src={cmt.avatar} alt={cmt.name} className="comment-avatar" />
                  <div className="comment-content">
                    <p className="comment-author">{cmt.name}</p>
                    <p className="comment-text">{cmt.text}</p>
                    <span className="comment-timestamp">{cmt.timestamp}</span>
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
                <button type="submit" disabled={isLoading || !newComment.trim()}>
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}