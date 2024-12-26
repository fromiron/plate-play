export const DEFAULT_COLORS = {
  BLACK: "rgba(0, 0, 0, 1)",
  WHITE: "rgba(255, 255, 255, 1)",
  TRANSPARENT: "rgba(0, 0, 0, 0)",
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

// FONT STYLES
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

// PADDINGS
export const PADDINGS = {
  "0PX": "p-0",
  "8PX": "p-2",
  "16PX": "p-4",
  "32PX": "p-8",
  "48PX": "p-12",
  "64PX": "p-16",
  "80PX": "p-20",
  "96PX": "p-24",
  "128PX": "p-32",
  "160PX": "p-40",
} as const;
export const PADDING_CLASSES = Object.values(PADDINGS);
export type Padding = (typeof PADDING_CLASSES)[keyof typeof PADDING_CLASSES];

// MARGINS
export const MARGIN_TOP = {
  "0PX": "mt-0",
  "8PX": "mt-2",
  "16PX": "mt-4",
  "32PX": "mt-8",
  "48PX": "mt-12",
  "64PX": "mt-16",
  "80PX": "mt-20",
  "96PX": "mt-24",
  "128PX": "mt-32",
  "160PX": "mt-40",
} as const;
export const MARGIN_TOP_CLASSES = Object.values(MARGIN_TOP);
export type MarginTop = (typeof MARGIN_TOP)[keyof typeof MARGIN_TOP];

export const MARGIN_BOTTOM = {
  "0PX": "mb-0",
  "8PX": "mb-2",
  "16PX": "mb-4",
  "32PX": "mb-8",
  "48PX": "mb-12",
  "64PX": "mb-16",
  "80PX": "mb-20",
  "96PX": "mb-24",
  "128PX": "mb-32",
  "160PX": "mb-40",
} as const;
export const MARGIN_BOTTOM_CLASSES = Object.values(MARGIN_BOTTOM);
export type MarginBottom = (typeof MARGIN_BOTTOM)[keyof typeof MARGIN_BOTTOM];

export const MARGIN_LEFT = {
  "0PX": "ml-0",
  "8PX": "ml-2",
  "16PX": "ml-4",
  "32PX": "ml-8",
  "48PX": "ml-12",
  "64PX": "ml-16",
  "80PX": "ml-20",
  "96PX": "ml-24",
  "128PX": "ml-32",
  "160PX": "ml-40",
} as const;
export const MARGIN_LEFT_CLASSES = Object.values(MARGIN_LEFT);
export type MarginLeft = (typeof MARGIN_LEFT)[keyof typeof MARGIN_LEFT];

export const MARGIN_RIGHT = {
  "0PX": "mr-0",
  "8PX": "mr-2",
  "16PX": "mr-4",
  "32PX": "mr-8",
  "48PX": "mr-12",
  "64PX": "mr-16",
  "80PX": "mr-20",
  "96PX": "mr-24",
  "128PX": "mr-32",
  "160PX": "mr-40",
} as const;
export const MARGIN_RIGHT_CLASSES = Object.values(MARGIN_RIGHT);
export type MarginRight = (typeof MARGIN_RIGHT)[keyof typeof MARGIN_RIGHT];

export type Direction = "vertical" | "horizontal";
export const DIRECTIONS: Record<string, Direction> = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
};

export const GAP_SIZE = {
  "0PX": "gap-0",
  "8PX": "gap-2",
  "16PX": "gap-4",
  "32PX": "gap-8",
  "48PX": "gap-12",
  "64PX": "gap-16",
  "80PX": "gap-20",
  "96PX": "gap-24",
  "128PX": "gap-32",
  "160PX": "gap-40",
} as const;
export type GapSize = (typeof GAP_SIZE)[keyof typeof GAP_SIZE];
export const GAP_SIZE_CLASSES = Object.values(GAP_SIZE);

export const BORDER_ROUNDED = {
  NONE: "rounded-none",
  SM: "rounded-sm",
  DEFAULT: "rounded",
  MD: "rounded-md",
  LG: "rounded-lg",
  XL: "rounded-xl",
  "2XL": "rounded-2xl",
  "3XL": "rounded-3xl",
  FULL: "rounded-full",
} as const;
export type BorderRounded =
  (typeof BORDER_ROUNDED)[keyof typeof BORDER_ROUNDED];
export const BORDER_ROUNDED_CLASSES = Object.values(BORDER_ROUNDED);

export const safeList = [
  ...TEXT_ALIGN_CLASSES,
  ...TEXT_SIZE_CLASSES,
  ...PADDING_CLASSES,
  ...FONT_WEIGHT_CLASSES,
  ...BORDER_ROUNDED_CLASSES,
  ...MARGIN_TOP_CLASSES,
  ...MARGIN_BOTTOM_CLASSES,
  ...MARGIN_LEFT_CLASSES,
  ...MARGIN_RIGHT_CLASSES,
  ...GAP_SIZE_CLASSES,
];
