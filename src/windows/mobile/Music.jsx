import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import MusicPlayer from "#components/MusicPlayer";
import { useTranslation } from "#store/language";

const MobileMusicContent = () => {
  const t = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <MobileWindowHeader windowKey="music" title={t("Music")} />

      <div className="flex-1 min-h-0">
        <MusicPlayer />
      </div>
    </div>
  );
};

const MobileMusic = MobileWindowWrapper(MobileMusicContent, "music");

export default MobileMusic;
