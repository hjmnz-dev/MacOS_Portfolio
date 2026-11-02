import { WindowControls } from "#components"
import LinkedInFeed from "#components/LinkedInFeed";
import WindowWrapper from "#hoc/WindowWrapper"
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, Share, ShieldHalf } from "lucide-react";
import React from 'react';
import { useTranslation } from "#store/language";

const Safari = () => {
  const t = useTranslation();
  return <>
    <div id="window-header">
        <WindowControls target="safari"/>

        <PanelLeft className="ml-10 icon"/>

        <div className="flex items-center gap-1 ml-5">
            <ChevronLeft className="icon"/>
            <ChevronRight className="icon"/>
        </div>

        <div className="flex-1 flex-center gap-3">
            <ShieldHalf className="icon"/>
            <div className="search">
                <Search className="icon"/>
                <input type="text" placeholder={t("Search or enter website name")} className="flex-1"/>
            </div>
        </div>

        <div className="flex items-center gap-5">
            <Share className="icon"/>
            <Plus className="icon"/>
            <Copy className="icon"/>
        </div>
    </div>

    <div className="blog">
        <h2>{t("My Developer Blog")}</h2>

        <LinkedInFeed/>
    </div>
  </>
}

const SafariWindow = WindowWrapper(Safari,'safari');

export default SafariWindow;
