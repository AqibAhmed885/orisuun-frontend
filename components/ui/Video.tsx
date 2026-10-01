
const Video = ({ src, className }) => {
  return (
    <video
      className={className}
      style={{objectFit: 'fill'}}
      autoPlay
      muted
      loop
      playsInline
      aria-label="Video player"
    >
      <track kind="captions" />
      <source src={src} type="video/mp4"/>
      Yur browser does not support video tag.
    </video>
  );
};
export default Video;