import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Local copies of the portfolio's Google Fonts, so a render never depends on the network
loadFont({ family: "Georama", url: staticFile("fonts/georama-latin-wght-normal.woff2"), weight: "100 900", style: "normal" });
loadFont({ family: "Georama", url: staticFile("fonts/georama-latin-wght-italic.woff2"), weight: "100 900", style: "italic" });
loadFont({ family: "Roboto Mono", url: staticFile("fonts/roboto-mono-latin-wght-normal.woff2"), weight: "100 700", style: "normal" });
