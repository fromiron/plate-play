export const DEFAULT_COLORS = {
  BLACK: "rgba(0, 0, 0, 1)",
  WHITE: "rgba(255, 255, 255, 1)",
};

// JUSTIFY ALIGNS
export const CONTENT_ALIGNS = {
  START: "flex-start",
  END: "flex-end",
  CENTER: "center",
  BETWEEN: "space-between",
  AROUND: "space-around",
  EVENLY: "space-evenly",
} as const;
export type ContentAlign = (typeof CONTENT_ALIGNS)[keyof typeof CONTENT_ALIGNS];
export const CONTENT_ALIGN_CLASSES = Object.values(CONTENT_ALIGNS);

// TEXT ALIGNS
export const TEXT_ALIGNS = {
  TEXT_ALIGN_LEFT: "text-left",
  TEXT_ALIGN_CENTER: "text-center",
  TEXT_ALIGN_RIGHT: "text-right",
} as const;
export type TextAlign = (typeof TEXT_ALIGNS)[keyof typeof TEXT_ALIGNS];
export const TEXT_ALIGN_CLASSES = Object.values(TEXT_ALIGNS);

// TEXT SIZES
export const TEXT_SIZES = {
  TEXT_SIZE_9XL: "text-9xl",
  TEXT_SIZE_8XL: "text-8xl",
  TEXT_SIZE_7XL: "text-7xl",
  TEXT_SIZE_6XL: "text-6xl",
  TEXT_SIZE_5XL: "text-5xl",
  TEXT_SIZE_4XL: "text-4xl",
  TEXT_SIZE_3XL: "text-3xl",
  TEXT_SIZE_2XL: "text-2xl",
  TEXT_SIZE_XL: "text-xl",
  TEXT_SIZE_LG: "text-lg",
  TEXT_SIZE_BASE: "text-base",
  TEXT_SIZE_SM: "text-sm",
  TEXT_SIZE_XS: "text-xs",
} as const;
export type TextSize = (typeof TEXT_SIZES)[keyof typeof TEXT_SIZES];
export const TEXT_SIZE_CLASSES = Object.values(TEXT_SIZES);

export const PADDINGS = {
  0: "p-0",
  2: "p-2",
  4: "p-4",
  8: "p-8",
  12: "p-12",
  16: "p-16",
  20: "p-20",
  24: "p-24",
  32: "p-32",
  40: "p-40",
} as const;
export const PADDING_CLASSES = Object.values(PADDINGS);
export type Padding = (typeof PADDING_CLASSES)[keyof typeof PADDING_CLASSES];

export const FONT_WEIGHTS = {
  THIN: "font-thin",
  EXTRALIGHT: "font-extralight",
  LIGHT: "font-light",
  NORMAL: "font-normal",
  MEDIUM: "font-medium",
  SEMIBOLD: "font-semibold",
  BOLD: "font-bold",
  EXTRABOLD: "font-extrabold",
  BLACK: "font-black",
} as const;
export const FONT_WEIGHT_CLASSES = Object.values(FONT_WEIGHTS);
export type FontWeight = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];

export const safeList = [
  ...TEXT_ALIGN_CLASSES,
  ...TEXT_SIZE_CLASSES,
  ...PADDING_CLASSES,
  ...FONT_WEIGHT_CLASSES,
];

export type Direction = "vertical" | "horizontal";
export const DIRECTIONS = { VERTICAL: "vertical", HORIZONTAL: "horizontal" };
