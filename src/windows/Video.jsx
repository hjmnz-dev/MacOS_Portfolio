import { useEffect, useRef } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { useVideoPlayback } from "#lib/video";

const Video = () => {
  const { windows, toggleMaximize } = useWindowStore();
  const { data, isMinimized, isMaximized } = windows.videofile;
  const videoRef = useRef(null);
  const { onPlay } = useVideoPlayback(videoRef, isMinimized);

  // La pantalla completa del reproductor cambia el tamaño de toda la página y desacomoda
  // la barra, el fondo y las ventanas: el video se agranda con el maximizar de la ventana.
  // Firefox ignora controlsList, así que si aun así entra en pantalla completa se devuelve a la ventana
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!videoRef.current || document.fullscreenElement !== videoRef.current) return;
      document.exitFullscreen().catch(() => {});
      if (!isMaximized) toggleMaximize("videofile");
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [isMaximized, toggleMaximize]);

  // La cabecera existe aunque no haya video: la ventana se arrastra solo desde ella y
  // el arrastre se configura al montar, antes de abrir el primer archivo
  const { name, videoUrl, poster } = data ?? {};

  return <>
    <div id="window-header">
      <WindowControls target="videofile" />
      <p>{name}</p>
    </div>

    <div className="preview">
      {/* key: al abrir otro video se recarga el reproductor desde el inicio */}
      {data && <video
        key={videoUrl}
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        controls
        controlsList="nofullscreen"
        autoPlay
        playsInline
        preload="metadata"
        onPlay={onPlay}
        onDoubleClick={() => toggleMaximize("videofile")}
      />}
    </div>
  </>
}

const VideoWindow = WindowWrapper(Video, "videofile");

export default VideoWindow;
