import React, { useEffect } from 'react';
import Hls from 'hls.js';

const LiveStream = () => {
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
    <div>
      <h2>Live Stream</h2>
      <video id="video" width="800" controls></video>
    </div>
  );
};

export default LiveStream;