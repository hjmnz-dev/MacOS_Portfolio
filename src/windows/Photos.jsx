import { WindowControls } from '#components';
import { gallery, photosLinks } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window.js';
import { Mail, Search } from 'lucide-react';
import { useTranslation } from "#store/language";


const Photos = () => {
  const t = useTranslation();
  const { openWindow } = useWindowStore();
  return (
    <>
      <div id='window-header'>
        <WindowControls target='photos' />

        <div className='w-full flex justify-end items-center gap-3 text-gray-500'>
          <Mail className='icon' />
          <Search className='icon' />
        </div>
      </div>

      <div className='flex w-full'>
        <div className='sidebar'>
          <h2>{t("Photos")}</h2>
          <ul>
            {photosLinks.map(({ id, icon, title }) => (
              <li key={id}>
                <img src={icon} alt={t(title)} />
                <p>{t(title)}</p>
              </li>

            ))}
          </ul>
        </div>

        <div className='gallery'>
          <ul>
            {gallery.map(({ id, img }) => (
              <li key={id} onClick={() => openWindow("imgfile", {
                id,
                name: "Gallery image",
                icon: "/images/image.png",
                kind: "file",
                fileType: "img",
                imageUrl: img,
              })}>
                <img src={img} alt={`${t("Gallery image")} ${id}`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

const PhotosWindow = WindowWrapper(Photos, "photos");
PhotosWindow.displayName = "Photos";
export default PhotosWindow;