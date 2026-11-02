import MobileWindowHeader from "#components/mobile/WindowHeader";
import { techStack } from "#constants";
import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import { Check, ChevronRight, Flag } from "lucide-react";
import { useTranslation } from "#store/language";

const MobileTerminalContent = () => {
  const t = useTranslation();
  return (
    <>
      <MobileWindowHeader windowKey="terminal" title="Terminal" />

      <div className="techstack">
        <p>
          <span className="font-bold">@hamsell %</span> {t("show tech stack")}
        </p>

        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex flex-col">
              <div className="flex flex-row">
                <ChevronRight className="check" size={20} />
                <h3>{t(category)}</h3>
              </div>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote">
          <p>
            <Check size={20} />{techStack.length} {t("of")} {techStack.length} {t("stacks loaded successfully (100%)")}
          </p>

          <p className="text-black dark:text-white">
            <Flag size={15} fill="currentColor" />
            {t("Render time: 6ms")}
          </p>
        </div>
      </div>
    </>
  );
};

const MobileTerminal = MobileWindowWrapper(MobileTerminalContent, "terminal");

export default MobileTerminal;
