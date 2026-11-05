import { musicTracks } from "#constants";
import useWindowStore from "#store/window";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VOLUME = 0.3;

// Fuera de React para que la música siga sonando al cerrar la ventana
const audio = new Audio();
audio.volume = DEFAULT_VOLUME;

// play() falla al cambiar de canción a medias; los errores reales llegan por el evento "error"
const startPlayback = () => audio.play().catch(() => {});

const useMusicStore = create(immer((set, get) => {
    const load = (index) => {
        set((state) => {
            state.currentIndex = index;
            state.currentTime = 0;
            state.duration = 0;
            state.hasError = false;
        });
        audio.src = musicTracks[index].src;
        startPlayback();
    };

    return {
        currentIndex: 0,
        isPlaying: false,
        hasError: false,
        currentTime: 0,
        duration: 0,
        durations: {},
        volume: DEFAULT_VOLUME,
        lastVolume: DEFAULT_VOLUME,
        shuffle: false,
        repeat: false,

        playTrack: (index) => {
            const { currentIndex, hasError } = get();
            const isLoaded = index === currentIndex && audio.getAttribute("src") && !hasError;

            if (!isLoaded) return load(index);
            if (audio.paused) startPlayback();
            else audio.pause();
        },

        playNext: () => {
            const { currentIndex, shuffle } = get();
            const step = shuffle ? 1 + Math.floor(Math.random() * (musicTracks.length - 1)) : 1;
            load((currentIndex + step) % musicTracks.length);
        },

        playPrevious: () => {
            const { currentIndex, seek } = get();
            // Como en los reproductores habituales: primero vuelve al inicio de la canción
            if (audio.currentTime > 3) return seek(0);
            load((currentIndex - 1 + musicTracks.length) % musicTracks.length);
        },

        pause: () => audio.pause(),

        toggleShuffle: () => set((state) => {
            state.shuffle = !state.shuffle;
        }),

        toggleRepeat: () => set((state) => {
            state.repeat = !state.repeat;
            audio.loop = state.repeat;
        }),

        seek: (time) => {
            audio.currentTime = time;
            set((state) => {
                state.currentTime = time;
            });
        },

        setVolume: (volume) => {
            audio.volume = volume;
            set((state) => {
                state.volume = volume;
                if (volume > 0) state.lastVolume = volume;
            });
        },

        toggleMute: () => {
            const { volume, lastVolume, setVolume } = get();
            setVolume(volume > 0 ? 0 : lastVolume);
        },
    };
}));

const update = (changes) => useMusicStore.setState(changes);

audio.addEventListener("play", () => update({ isPlaying: true, hasError: false }));
audio.addEventListener("pause", () => update({ isPlaying: false }));
audio.addEventListener("error", () => update({ isPlaying: false, hasError: true }));
audio.addEventListener("loadedmetadata", () => update({ duration: audio.duration }));
audio.addEventListener("timeupdate", () => update({ currentTime: audio.currentTime }));
audio.addEventListener("ended", () => useMusicStore.getState().playNext());

// Las duraciones de la lista se piden solo si alguien abre el reproductor
let durationsRequested = false;

useWindowStore.subscribe(({ windows }) => {
    if (durationsRequested || !windows.music.isOpen) return;
    durationsRequested = true;

    musicTracks.forEach(({ id, src }) => {
        const probe = new Audio();
        probe.preload = "metadata";
        probe.addEventListener("loadedmetadata", () => useMusicStore.setState((state) => {
            state.durations[id] = probe.duration;
        }));
        probe.src = src;
    });
});

export default useMusicStore;
