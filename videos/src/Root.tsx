import { Composition } from "remotion";

import { DURATION } from "./videos/portfolio-promo/cues";
import { PortfolioPromo, type PromoProps } from "./videos/portfolio-promo/PortfolioPromo";

export const RemotionRoot = () => (
  <Composition
    id="PortfolioPromo"
    component={PortfolioPromo}
    width={1920}
    height={1080}
    fps={60}
    durationInFrames={Math.round(DURATION * 60)}
    defaultProps={{ fps: 60, debug: false } satisfies PromoProps}
    calculateMetadata={({ props }) => ({
      fps: props.fps,
      durationInFrames: Math.round(DURATION * props.fps),
    })}
  />
);
