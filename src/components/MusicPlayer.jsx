import { useState } from "react";
import {
  Clock3,
  House,
  Library,
  Music2,
  Pause,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import clsx from "clsx";
import { musicTracks } from "#constants";
import useMusicStore from "#store/music";
import { useTranslation } from "#store/language";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

const Cover = ({ color, className }) => (
  <span className={clsx("cover", className)} style={{ "--cover": color }}>
    <Music2 />
  </span>
);

const PLAYLIST_COLOR = "#1db954";

const MusicPlayer = ({ windowControls }) => {
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const {
    currentIndex,
    isPlaying,
    hasError,
    currentTime,
    duration,
    durations,
    volume,
    shuffle,
    repeat,
    playTrack,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    seek,
    setVolume,
    toggleMute,
  } = useMusicStore();

  const current = musicTracks[currentIndex];
  const status = hasError ? "Couldn't load" : isPlaying ? "Playing" : "Paused";
  const playLabel = t(isPlaying ? "Pause" : "Play");
  const PlayIcon = isPlaying ? Pause : Play;
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = Math.round(volume * 100);
  const search = query.trim().toLowerCase();
  const tracks = musicTracks
    .map((track, index) => ({ ...track, index }))
    .filter(({ title }) => title.toLowerCase().includes(search));

  const searchBox = (className) => (
    <label className={clsx("music-search", className)}>
      <Search size={18} />
      <input
        type="search"
        value={query}
        placeholder={t("Search songs")}
        aria-label={t("Search songs")}
        onChange={(e) => setQuery(e.target.value)}
      />
    </label>
  );

  return (
    <div className="music-app">
      {windowControls && (
        <div className="music-top">
          <div id="window-header">{windowControls}</div>
          {/* Fuera del encabezado: es la zona de arrastre y no dejaría escribir */}
          <div className="top-search">
            <span className="home-icon">
              <House size={18} />
            </span>
            {searchBox()}
          </div>
        </div>
      )}

      <div className="music-body">
        <aside>
          <h3>
            <Library size={20} />
            {t("Your Library")}
          </h3>

          <div className="library-item">
            <Cover color={PLAYLIST_COLOR} />
            <div>
              <p>{t("Hamsell's Playlist")}</p>
              <span>
                Playlist • {musicTracks.length} {t("songs")}
              </span>
            </div>
          </div>
        </aside>

        <section className="music-main">
          <header className="hero">
            <Cover color={PLAYLIST_COLOR} className="large" />
            <div>
              <span>Playlist</span>
              <h2>{t("Hamsell's Playlist")}</h2>
              <p>
                Hamsell • {musicTracks.length} {t("songs")}
              </p>
            </div>
          </header>

          <div className="actions">
            <button
              type="button"
              className="big-play"
              aria-label={playLabel}
              onClick={() => playTrack(currentIndex)}
            >
              <PlayIcon size={24} fill="currentColor" />
            </button>
            {!windowControls && searchBox("flex-1")}
          </div>

          <div className="track-head">
            <span>#</span>
            <span>{t("Title")}</span>
            <Clock3 size={16} aria-label={t("Duration")} />
          </div>

          <ul>
            {tracks.map(({ id, title, color, index }) => {
              const isCurrent = index === currentIndex;
              const isActive = isCurrent && isPlaying;

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={clsx("track", isCurrent && "current")}
                    aria-label={`${t(isActive ? "Pause" : "Play")}: ${title}`}
                    onClick={() => playTrack(index)}
                  >
                    <span className="number">
                      {isActive ? (
                        <span className="equalizer">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <>
                          <span className="position">{index + 1}</span>
                          <Play size={14} fill="currentColor" className="hint" />
                        </>
                      )}
                    </span>
                    <span className="title">
                      <Cover color={color} />
                      <span className="truncate">{title}</span>
                    </span>
                    <span className="time">
                      {durations[id] ? formatTime(durations[id]) : "–:––"}
                    </span>
                  </button>
                </li>
              );
            })}

            {tracks.length === 0 && (
              <li className="empty">{t("No songs found")}</li>
            )}
          </ul>

          {/* La licencia CC BY 4.0 exige este crédito: no quitarlo ni traducirlo */}
          <p className="credit">
            {musicTracks.map(({ title }) => `"${title}"`).join(", ")} Kevin MacLeod (
            <a href="https://incompetech.com" target="_blank" rel="noopener noreferrer">
              incompetech.com
            </a>
            ) Licensed under Creative Commons:{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              By Attribution 4.0 License
            </a>
          </p>
        </section>
      </div>

      <footer className="player-bar">
        <div className="now-playing">
          <Cover color={current.color} />
          <div className="min-w-0">
            <p className="truncate">{current.title}</p>
            <span className={clsx(hasError && "error")} aria-live="polite">
              {t(status)}
            </span>
          </div>
        </div>

        <div className="transport">
          <button
            type="button"
            className={clsx("toggle", shuffle && "on")}
            aria-label={t("Shuffle")}
            aria-pressed={shuffle}
            title={t("Shuffle")}
            onClick={toggleShuffle}
          >
            <Shuffle size={18} />
          </button>
          <button
            type="button"
            aria-label={t("Previous")}
            title={t("Previous")}
            onClick={playPrevious}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            type="button"
            className="main-play"
            aria-label={playLabel}
            title={playLabel}
            onClick={() => playTrack(currentIndex)}
          >
            <PlayIcon size={18} fill="currentColor" />
          </button>
          <button
            type="button"
            aria-label={t("Next")}
            title={t("Next")}
            onClick={playNext}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button
            type="button"
            className={clsx("toggle", repeat && "on")}
            aria-label={t("Repeat")}
            aria-pressed={repeat}
            title={t("Repeat")}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
          </button>
        </div>

        <div className="progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="music-slider"
            style={{ "--progress": `${progress}%` }}
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            disabled={!duration}
            aria-label={t("Song position")}
            aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume">
          <button
            type="button"
            aria-label={t(volume > 0 ? "Mute" : "Unmute")}
            title={t(volume > 0 ? "Mute" : "Unmute")}
            onClick={toggleMute}
          >
            {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <input
            type="range"
            className="music-slider"
            style={{ "--progress": `${volumePercent}%` }}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label={t("Volume")}
            aria-valuetext={`${volumePercent}%`}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </footer>
    </div>
  );
};

export default MusicPlayer;
