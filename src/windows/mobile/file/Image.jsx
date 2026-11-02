import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import useWindowStore from "#store/window";
import { useTranslation } from "#store/language";

const MobileImageContent = () => {
  const t = useTranslation();
  const {
    windows: {
      imgfile: { data },
    },
  } = useWindowStore();

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <>
      <MobileWindowHeader windowKey="imgfile" title={t("Preview")} />

      <div className="preview">
        <img src={imageUrl} alt={t(name)} />
      </div>
    </>
  );
};

const MobileImage = MobileWindowWrapper(MobileImageContent, "imgfile");

export default MobileImage;
