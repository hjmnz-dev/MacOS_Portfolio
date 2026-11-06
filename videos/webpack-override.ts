import { enableTailwind } from "@remotion/tailwind-v4";
import type { WebpackOverrideFn } from "@remotion/bundler";

// The portfolio's CSS points at the site's public folder (/images/...), which the bundler
// would try to resolve as files. The film draws its own wallpaper, so those URLs stay as they are.
const keepCssUrls = (rule: unknown): void => {
  if (!rule || typeof rule !== "object") return;
  const { use, oneOf, rules, loader, options } = rule as Record<string, any>;
  if (typeof loader === "string" && /[\\/]css-loader[\\/]/.test(loader)) {
    (rule as Record<string, any>).options = { ...options, url: false };
  }
  [use, oneOf, rules].filter(Array.isArray).forEach((list) => list.forEach(keepCssUrls));
};

export const webpackOverride: WebpackOverrideFn = (config) => {
  const next = enableTailwind(config);
  next.module?.rules?.forEach(keepCssUrls);
  return next;
};
