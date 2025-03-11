'use client';

import Hls from 'hls.js';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBack, IoEllipsisVertical, IoEye, IoHeart, IoSend, IoShare } from 'react-icons/io5';
import Layout from '../../src/Components/Layout';

export default function LiveStream() {
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const router = useRouter();
  const videoSrc = 'http://localhost:8080/hls/test.m3u8';

  // Shop information
  const shopInfo = {
    name: 'Laptop Store',
    avatar: '/images/default-image.jpg',
    topic: 'Hot sale: 50% off on gaming laptops!',
    followers: '12.5K',
    products: 128,
  };

  // Stream stats
  const [viewers, setViewers] = useState(1280);
  const [likes, setLikes] = useState(856);
  const [isLiked, setIsLiked] = useState(false);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Alice',
      avatar: '/images/default-image.jpg',
      text: 'Great show! I\'m really interested in this gaming laptop series.',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Bob',
      avatar: '/images/default-image.jpg',
      text: 'This product looks great! Are there other colors available?',
      timestamp: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Charlie',
      avatar: '/images/default-image.jpg',
      text: 'Is there a discount? I need one for work.',
      timestamp: '8 minutes ago'
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play().catch(error => {
            console.log("Auto-play was prevented:", error);
          });
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }

    // Simulate real-time viewer count updates
    const viewerInterval = setInterval(() => {
      setViewers(prev => Math.floor(prev + (Math.random() * 10 - 5)));
    }, 5000);

    return () => clearInterval(viewerInterval);
  }, []);

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (newComment.trim()) {
      setIsLoading(true);
      // Simulate network delay
      setTimeout(() => {
        const newCmt = {
          id: comments.length + 1,
          name: 'You',
          avatar: '/images/default-image.jpg',
          text: newComment.trim(),
          timestamp: 'Just now'
        };
        setComments(prev => [...prev, newCmt]);
        setNewComment('');
        setIsLoading(false);
        
        // Auto scroll to bottom
        if (commentsRef.current) {
          commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
      }, 500);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatNumber = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num;
  };

  return (
    <Layout title="Live Stream">
      <div className="livestream-page">
        <div className="livestream-container">
          {/* Main Content */}
          <div className="livestream-main">
            {/* Header */}
            <div className="livestream-header">
              <button onClick={() => router.back()} className="back-button">
                <IoArrowBack size={20} />
                <span>Back</span>
              </button>
              
              <div className="shop-info">
                <img
                  src={shopInfo.avatar}
                  alt={shopInfo.name}
                  className="shop-avatar"
                />
                <div className="shop-details">
                  <h2 className="shop-name">{shopInfo.name}</h2>
                  <p className="shop-topic">{shopInfo.topic}</p>
                </div>
                <div className="viewers">
                  <IoEye size={18} />
                  <span>{formatNumber(viewers)}</span>
                </div>
                <div className="action-buttons">
                  <button 
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                  >
                    <IoHeart size={20} />
                    <span>{formatNumber(likes)}</span>
                  </button>
                  <button className="share-button" title="Share">
                    <IoShare size={20} />
                  </button>
                  <button className="more-button" title="More options">
                    <IoEllipsisVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Video */}
            <video
              ref={videoRef}
              controls
              playsInline
              className="livestream-video"
              poster="/images/default-image.jpg"
            />

            {/* Video Overlay */}
            <div className="video-overlay">
              {/* Additional controls or information can be added here */}
            </div>
          </div>

          {/* Comments Section */}
          <div className="comment-section">
            <div className="comment-header">
              <h3>Comments</h3>
              <span className="comment-count">{comments.length}</span>
            </div>

            <div className="comments-container" ref={commentsRef}>
              {comments.map((cmt) => (
                <div key={cmt.id} className="comment">
                  <img
                    src={cmt.avatar}
                    alt={cmt.name}
                    className="comment-avatar"
                  />
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
                <button 
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                >
                  {isLoading ? (
                    <span className="loading-dots">Sending</span>
                  ) : (
                    <>
                      <span>Send</span>
                      <IoSend size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
