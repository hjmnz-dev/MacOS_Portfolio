import { useEffect } from "react";
import useMusicStore from "#store/music";

// El video y la música no suenan a la vez: al reproducir uno se pausa el otro.
// Además el video se pausa si su ventana queda oculta (minimizada en escritorio).
export const useVideoPlayback = (videoRef, isHidden) => {
  const isMusicPlaying = useMusicStore((state) => state.isPlaying);
  const pauseMusic = useMusicStore((state) => state.pause);

  useEffect(() => {
    if (isMusicPlaying) videoRef.current?.pause();
  }, [isMusicPlaying, videoRef]);

  useEffect(() => {
    if (isHidden) videoRef.current?.pause();
  }, [isHidden, videoRef]);

  return { onPlay: pauseMusic };
};
