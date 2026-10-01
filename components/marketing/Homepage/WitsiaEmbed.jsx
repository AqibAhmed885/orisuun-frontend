// 'use client';
// import { useEffect, useRef } from 'react';

// const WistiaEmbed = ({ videoId, autoPlay = false }) => {
//   const embedRef = useRef(null);

//   useEffect(() => {
//     if (!videoId) return;

//     const scriptId = `wistia-script-${videoId}`;

//     // Prevent duplicate scripts for same video
//     if (!document.getElementById(scriptId)) {
//       const scriptJsonp = document.createElement('script');
//       scriptJsonp.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
//       scriptJsonp.async = true;
//       scriptJsonp.id = scriptId;
//       document.body.appendChild(scriptJsonp);

//       const scriptCore = document.createElement('script');
//       scriptCore.src = 'https://fast.wistia.com/assets/external/E-v1.js';
//       scriptCore.async = true;
//       document.body.appendChild(scriptCore);
//     }
//   }, [videoId]);

//   return (
//     <div
//       ref={embedRef}
//       className="wistia_responsive_padding"
//       style={{ padding: '56.25% 0 0 0', position: 'relative' }}
//     >
//       <div
//         className="wistia_responsive_wrapper"
//         style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
//       >
//         <div
//           className={`wistia_embed wistia_async_${videoId} seo=true videoFoam=true ${autoPlay ? 'autoPlay=true' : ''}`}
//           style={{ height: '100%', position: 'relative', width: '100%' }}
//         >
//           &nbsp;
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WistiaEmbed;

// 'use client';
// import { useEffect, useRef } from 'react';
 
// const WistiaEmbed = () => {
//   const scriptsLoadedRef = useRef(false);
 
//   useEffect(() => {
//     if (!scriptsLoadedRef.current) {
//       const script1 = document.createElement('script');
//       script1.src = 'https://fast.wistia.com/embed/medias/j7eh2674jx.jsonp';
//       script1.defer = true;
//       script1.async = true;
//       document.body.appendChild(script1);
 
//       const script2 = document.createElement('script');
//       script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
//       script2.defer = true;
//       script2.async = true;
//       document.body.appendChild(script2);
 
//       scriptsLoadedRef.current = true;
 
//       return () => {
//         document.body.removeChild(script1);
//         document.body.removeChild(script2);
//       };
//     }
//   }, []);
 
//   return (
//     <div
//       className="wistia_responsive_padding"
//       style={{ padding: '62.5% 0 0 0', position: 'relative' }}
//     >
//       <div
//         className="wistia_responsive_wrapper"
//         style={{
//           height: '100%',
//           left: 0,
//           position: 'absolute',
//           top: 0,
//           width: '100%',
//         }}
//       >
//         <div
//           className="wistia_embed wistia_async_j7eh2674jx seo=true videoFoam=true"
//           style={{ height: '100%', position: 'relative', width: '100%' }}
//         >
//           &nbsp;
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default WistiaEmbed;
 
// 'use client';
// import { useEffect, useRef } from 'react';
 
// const WistiaEmbed = () => {
//   const embedRef = useRef(null);
//   const scriptsLoadedRef = useRef(false);
 
//   useEffect(() => {
//     const loadScripts = () => {
//       if (!scriptsLoadedRef.current) {
//         const script1 = document.createElement('script');
//         script1.src = 'https://fast.wistia.com/embed/medias/j7eh2674jx.jsonp';
//         script1.defer = true;
//         script1.async = true;
//         document.body.appendChild(script1);
 
//         const script2 = document.createElement('script');
//         script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
//         script2.defer = true;
//         script2.async = true;
//         document.body.appendChild(script2);
 
//         scriptsLoadedRef.current = true;
//       }
//     };
 
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadScripts();
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 } // Adjust the threshold as needed
//     );
 
//     if (embedRef.current) {
//       observer.observe(embedRef.current);
//     }
 
//     return () => {
//       observer.disconnect();
//     };
//   }, []);
 
//   return (
//     <div
//       ref={embedRef}
//       className="wistia_responsive_padding"
//       style={{ padding: '62.5% 0 0 0', position: 'relative' }}
//     >
//       <div
//         className="wistia_responsive_wrapper"
//         style={{
//           height: '100%',
//           left: 0,
//           position: 'absolute',
//           top: 0,
//           width: '100%',
//         }}
//       >
//         <div
//           className="wistia_embed wistia_async_j7eh2674jx seo=true videoFoam=true"
//           style={{ height: '100%', position: 'relative', width: '100%' }}
//         >
//           &nbsp;
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default WistiaEmbed;

'use client';
import { useEffect, useRef } from 'react';

const WistiaEmbed = ({ videoId = 'j7eh2674jx', autoLoad = false }) => {
  const embedRef = useRef(null);
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    const loadScripts = () => {
      if (!scriptsLoadedRef.current) {
        const script1 = document.createElement('script');
        script1.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
        script1.defer = true;
        script1.async = true;
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
        script2.defer = true;
        script2.async = true;
        document.body.appendChild(script2);

        scriptsLoadedRef.current = true;
        console.log('Wistia scripts injected for', videoId);
      }
    };

    if (autoLoad) {
      loadScripts();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadScripts();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (embedRef.current) {
      observer.observe(embedRef.current);
    }

    return () => observer.disconnect();
  }, [videoId, autoLoad]);

  return (
    <div
      ref={embedRef}
      className="wistia_responsive_padding bg-blue-strong"
      style={{  position: 'relative' }}
    >
      <div
        className="wistia_responsive_wrapper "
        style={{
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
      >
        <div
          className={`wistia_embed wistia_async_${videoId} seo=true videoFoam=true`}
          style={{
            height: '100%', position: 'relative', width: '100%', objectFit: 'cover',
 }}
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default WistiaEmbed;


// 'use client';
// import { useEffect, useRef } from 'react';

// const WistiaEmbed = () => {
//   const scriptsLoadedRef = useRef(false);

//   useEffect(() => {
//     if (!scriptsLoadedRef.current) {
//       const script1 = document.createElement('script');
//       script1.src = 'https://fast.wistia.com/embed/medias/j7eh2674jx.jsonp';
//       script1.defer = true;
//       script1.async = true;
//       document.body.appendChild(script1);

//       const script2 = document.createElement('script');
//       script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
//       script2.defer = true;
//       script2.async = true;
//       document.body.appendChild(script2);

//       scriptsLoadedRef.current = true;

//       return () => {
//         document.body.removeChild(script1);
//         document.body.removeChild(script2);
//       };
//     }
//   }, []);

//   return (
//     <div
//       className="wistia_responsive_padding"
//       style={{ padding: '62.5% 0 0 0', position: 'relative' }}
//     >
//       <div
//         className="wistia_responsive_wrapper"
//         style={{
//           height: '100%',
//           left: 0,
//           position: 'absolute',
//           top: 0,
//           width: '100%',
//         }}
//       >
//         <div
//           className="wistia_embed wistia_async_j7eh2674jx seo=true videoFoam=true"
//           style={{ height: '100%', position: 'relative', width: '100%' }}
//         >
//           &nbsp;
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WistiaEmbed;

// 'use client';
// import { useEffect, useRef } from 'react';

// const WistiaEmbed = () => {
//   const embedRef = useRef(null);
//   const scriptsLoadedRef = useRef(false);

//   useEffect(() => {
//     const loadScripts = () => {
//       if (!scriptsLoadedRef.current) {
//         const script1 = document.createElement('script');
//         script1.src = 'https://fast.wistia.com/embed/medias/j7eh2674jx.jsonp';
//         script1.defer = true;
//         script1.async = true;
//         document.body.appendChild(script1);

//         const script2 = document.createElement('script');
//         script2.src = 'https://fast.wistia.com/assets/external/E-v1.js';
//         script2.defer = true;
//         script2.async = true;
//         document.body.appendChild(script2);

//         scriptsLoadedRef.current = true;
//       }
//     };

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadScripts();
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 } // Adjust the threshold as needed
//     );

//     if (embedRef.current) {
//       observer.observe(embedRef.current);
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <div
//       ref={embedRef}
//       className="wistia_responsive_padding"
//       style={{ padding: '62.5% 0 0 0', position: 'relative' }}
//     >
//       <div
//         className="wistia_responsive_wrapper"
//         style={{
//           height: '100%',
//           left: 0,
//           position: 'absolute',
//           top: 0,
//           width: '100%',
//         }}
//       >
//         <div
//           className="wistia_embed wistia_async_j7eh2674jx seo=true videoFoam=true"
//           style={{ height: '100%', position: 'relative', width: '100%' }}
//         >
//           &nbsp;
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WistiaEmbed;
