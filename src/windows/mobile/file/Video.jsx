import { useRef } from "react";
import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import useWindowStore from "#store/window";
import { useVideoPlayback } from "#lib/video";

const MobileVideoContent = () => {
  const {
    windows: {
      videofile: { data },
    },
  } = useWindowStore();
  const videoRef = useRef(null);
  // Esta vista solo existe mientras la ventana está visible: al ocultarse se desmonta y el video se detiene
  const { onPlay } = useVideoPlayback(videoRef, false);

  if (!data) return null;

  const { name, videoUrl, poster } = data;

  return (
    <>
      <MobileWindowHeader windowKey="videofile" title={name} />

      <div className="preview">
        <video
          key={videoUrl}
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onPlay={onPlay}
        />
      </div>
    </>
  );
};

const MobileVideo = MobileWindowWrapper(MobileVideoContent, "videofile");

export default MobileVideo;
