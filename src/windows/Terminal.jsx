import WindowControls from '#components/WindowControls';
import { techStack } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import { Check, Flag } from 'lucide-react';
import React from 'react'
import { useTranslation } from "#store/language";

const Terminal = () => {
  const t = useTranslation();
  return (
    <>
        <div id='window-header'>
            <WindowControls target='terminal'/>
            <h2>{t("Tech Stack")}</h2>
        </div>

        <div className='techstack'>
            <p>
                <span className='font-bold'>@hamsell % </span>
                {t("show tech stack")}
            </p>

            <div className='label'>
                <p className='w-32'>{t("Category")}</p>
                <p>{t("Technologies")}</p>
            </div>

            <ul className='content'>
                {techStack.map(({category, items}) => (
                    <li key={category} className='flex items-center'>
                        <Check className='check' size={20}/>
                        <h3>{t(category)}</h3>
                        <ul>
                            {items.map((item,i)=>(
                                <li key={i}>{item}{i<items.length - 1 ? ", " : ""}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className='footnote'>
                <p>
                    <Check size={20}/> {techStack.length} {t("of")} {techStack.length} {t("stacks loaded successfully (100%)")}
                </p>
                <p className='text-black dark:text-white'>
                    <Flag size={15} fill='currentColor'/>
                    {t("Render time: 6ms")}
                </p>
            </div>
        </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal,'terminal');

export default TerminalWindow;