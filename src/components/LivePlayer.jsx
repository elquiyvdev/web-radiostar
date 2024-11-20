import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const LivePlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);
  let player;

  useEffect(() => {
    if (videoRef.current) {
      player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [
          {
            src: streamUrl,
            type: 'application/dash+xml'
          }
        ]
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [streamUrl]);

  return (
    <div>
      <h2 >Live Stream</h2>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js w-full h-96 max-w-full border border-gray-200 rounded-lg dark:border-gray-700"></video>
      </div>
    </div>
  );
};

export default LivePlayer;