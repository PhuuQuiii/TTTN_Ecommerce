'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function LiveStream() {
  const videoRef = useRef(null);
  const videoSrc = 'http://localhost:8080/hls/test.m3u8';

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
  }, []);

  return (
    <div>
      <h2>Live Stream</h2>
      <video ref={videoRef} width="800" controls />
    </div>
  );
}