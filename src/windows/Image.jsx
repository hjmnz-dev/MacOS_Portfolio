import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { useTranslation } from "#store/language";

const Image = () => {
  const t = useTranslation();
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;

  if (!data) return null;

  const { name, imageUrl } = data;

  return <>
    <div id="window-header">
      <WindowControls target="imgfile" />
      <p>{t(name)}</p>
    </div>

    <div className="preview">
      {imageUrl && <img src={imageUrl} alt={t(name)} />}
    </div>
  </>
}

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
