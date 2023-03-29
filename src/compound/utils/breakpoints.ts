export type BreakPoint =
  | "mobile"
  | "tablet"
  | "laptop"
  | "desktop"
  | "wideScreen";

export const breakPoints: Array<BreakPoint> = [
  "mobile",
  "tablet",
  "laptop",
  "desktop",
  "wideScreen",
];

export const breakPointSizes: { [k in BreakPoint]: number } = {
  mobile: 425,
  tablet: 768,
  laptop: 1024,
  desktop: 1488,
  wideScreen: 2560,
};

export const deviceMaximums: { [k in BreakPoint]: string } = {
  mobile: `(max-width: ${breakPointSizes.tablet}px)`,
  tablet: `(max-width: ${breakPointSizes.laptop}px)`,
  laptop: `(max-width: ${breakPointSizes.desktop}px)`,
  desktop: `(max-width: ${breakPointSizes.wideScreen}px)`,
  wideScreen: `(min-width: ${breakPointSizes.wideScreen + 1}px)`,
};

/***
 * A css selector for applying styles with a mobile first approach.
 * Each breakpoint will apply styles to the given device and larger.
 * For example. Using mediaSelectors.tablet will apply styles to devices
 * with tablet size or larger
 */
export const mediaSelector: { [k in BreakPoint]: string } = {
  mobile: `(max-width: ${breakPointSizes.tablet - 1}px)`,
  tablet: `(min-width: ${breakPointSizes.tablet}px)`,
  laptop: `(min-width: ${breakPointSizes.laptop}px)`,
  desktop: `(min-width: ${breakPointSizes.desktop}px)`,
  wideScreen: `(min-width: ${breakPointSizes.wideScreen}px)`,
};
