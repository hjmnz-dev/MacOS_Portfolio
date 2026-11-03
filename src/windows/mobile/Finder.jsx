import { useState } from "react";
import { ChevronRight } from "lucide-react";
import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import useWindowStore from "#store/window";
import { locations } from "#constants";
import { useTranslation } from "#store/language";

const MobileFinderContent = () => {
  const t = useTranslation();
  const { closeWindow, openWindow } = useWindowStore();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const rootFolders = Object.values(locations);
  // Solo las carpetas principales (las que tienen type) siguen el idioma; proyectos y archivos no
  const itemName = (item) => (item.type ? t(item.name) : item.name);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumb([...breadcrumb, folder]);
  };

  const handleBackClick = () => {
    if (breadcrumb.length === 0) {
      closeWindow("finder");
    } else if (breadcrumb.length === 1) {
      setCurrentFolder(null);
      setBreadcrumb([]);
    } else {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1]);
    }
  };

  const handleItemClick = (item) => {
    if (item.kind === "folder") {
      handleFolderClick(item);
      return;
    }

    // Handle file types
    if (item.fileType === "pdf") {
      openWindow("resume");
    } else if (["fig", "url"].includes(item.fileType)) {
      // Los proyectos aún no tienen enlace: sin href, estos archivos no abren nada
      if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      openWindow(`${item.fileType}${item.kind}`, item);
    }
  };

  const currentItems = currentFolder?.children || rootFolders;

  return (
    <>
      <MobileWindowHeader
        windowKey="finder"
        title={currentFolder ? itemName(currentFolder) : t("Portfolio")}
        onBack={handleBackClick}
      />

      {breadcrumb.length > 0 && (
        <div className="breadcrumb">
          <button
            onClick={() => {
              setCurrentFolder(null);
              setBreadcrumb([]);
            }}
            className="text-blue-500 text-sm"
          >
            {t("Portfolio")}
          </button>
          {breadcrumb.map((folder, index) => (
            <span key={folder.id} className="flex items-center">
              <ChevronRight size={16} className="text-gray-400 mx-1" />
              <button
                onClick={() => {
                  const newBreadcrumb = breadcrumb.slice(0, index + 1);
                  setBreadcrumb(newBreadcrumb);
                  setCurrentFolder(folder);
                }}
                className="text-blue-500 text-sm line-clamp-1 text-left"
              >
                {itemName(folder)}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="finder-gallery">
        <ul>
          {currentItems?.map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item)}>
              <div className="finder-item">
                {item.kind === "folder" ? (
                  <img
                    src="/images/folder.png"
                    alt={t("folder")}
                    className="size-16"
                  />
                ) : (
                  <img src={item.icon} alt={itemName(item)} className="file-icon" />
                )}
                <p className="item-name">{itemName(item)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const MobileFinder = MobileWindowWrapper(MobileFinderContent, "finder");

export default MobileFinder;
