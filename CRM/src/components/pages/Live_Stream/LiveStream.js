import Hls from 'hls.js';
import React, { useEffect } from 'react';

const LayoutLiveStream = () => {
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

  return (
    <div className="live-stream-container">
      <div className="live-stream-header">
        <h2>Live Stream</h2>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
      </div>
      <div className="live-stream-content">
        <video id="video" controls></video>
        <div className="live-stream-info">
          <div className="viewer-count">
            <i className="fas fa-eye"></i>
            <span>1.2K watching</span>
          </div>
          <div className="stream-quality">
            <i className="fas fa-tachometer-alt"></i>
            <span>HD Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutLiveStream;