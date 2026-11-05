import { useRef } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { useVideoPlayback } from "#lib/video";

const Video = () => {
  const { windows } = useWindowStore();
  const { data, isMinimized } = windows.videofile;
  const videoRef = useRef(null);
  const { onPlay } = useVideoPlayback(videoRef, isMinimized);

  if (!data) return null;

  const { name, videoUrl, poster } = data;

  return <>
    <div id="window-header">
      <WindowControls target="videofile" />
      <p>{name}</p>
    </div>

    <div className="preview">
      {/* key: al abrir otro video se recarga el reproductor desde el inicio */}
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
}

const VideoWindow = WindowWrapper(Video, "videofile");

export default VideoWindow;
