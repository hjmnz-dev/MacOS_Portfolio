import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";

const Image = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;

  if (!data) return null;

  const { name, imageUrl } = data;

  return <>
    <div id="window-header">
      <WindowControls target="imgfile" />
      <p>{name}</p>
    </div>

    <div className="preview">
      {imageUrl && <img src={imageUrl} alt={name} />}
    </div>
  </>
}

const ImageWindow = WindowWrapper(Image, "imgfile");

export default ImageWindow;
