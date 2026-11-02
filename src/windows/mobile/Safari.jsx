import LinkedInFeed from "#components/LinkedInFeed";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mic,
  Search,
  Share,
} from "lucide-react";
import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import { useTranslation } from "#store/language";

const MobileSafariContent = () => {
  const t = useTranslation();
  return (
    <>
      <MobileWindowHeader windowKey="safari" title="Safari" />

      <div className="blog">
        <h2>{t("My Developer Blog")}</h2>

        <LinkedInFeed />
      </div>

      <footer>
        <div className="search">
          <Search className="icon" />
          <input
            type="text"
            placeholder={t("Search or enter website name")}
            className="flex-1"
          />
          <Mic className="icon" />
        </div>

        <div>
          <ChevronLeft size={32} className="icon text-gray-500" />
          <ChevronRight size={32} className="icon text-gray-500" />

          <Share size={32} className="icon text-blue-600" />
          <BookOpen size={32} className="icon text-blue-600" />

          <Copy size={32} className="icon text-blue-600" />
        </div>
      </footer>
    </>
  );
};

const MobileSafari = MobileWindowWrapper(MobileSafariContent, "safari");

export default MobileSafari;
