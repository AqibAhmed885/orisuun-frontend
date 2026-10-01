'use client';
import { useEffect, useRef } from 'react';

const DemoEmbed = () => {
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (!scriptsLoadedRef.current) {
      // Load the player.js
      const script1 = document.createElement('script');
      script1.src = 'https://fast.wistia.com/player.js';
      script1.async = true;
      document.body.appendChild(script1);

      // Load the embed JS for specific video
      const script2 = document.createElement('script');
      script2.src = 'https://fast.wistia.com/embed/55hjremisj.js';
      script2.type = 'module';
      script2.async = true;
      document.body.appendChild(script2);

      scriptsLoadedRef.current = true;

      return () => {
        script1.remove();
        script2.remove();
        scriptsLoadedRef.current = false;
      };
    }
  }, []);

  return (
    <>
      <style>
        {`
          wistia-player[media-id='55hjremisj']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/55hjremisj/swatch');
            display: block;
            filter: blur(5px);
            padding-top: 56.25%;
          }
        `}
      </style>

      <wistia-player
        media-id="55hjremisj"
        aspect="1.7777777777777777"
      ></wistia-player>
    </>
  );
};

export default DemoEmbed;
