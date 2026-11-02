import { WindowControls } from "#components";
import MusicPlayer from "#components/MusicPlayer";
import WindowWrapper from "#hoc/WindowWrapper";

const Music = () => <MusicPlayer windowControls={<WindowControls target="music" />} />;

const MusicWindow = WindowWrapper(Music, "music");

export default MusicWindow;
