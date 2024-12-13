import type { Config } from "@measured/puck";

const TEXT_BLACK = "text-black";
const TEXT_RED = "text-red-900";
const TEXT_ALIGN_LEFT = "text-left";
const TEXT_ALIGN_CENTER = "text-center";
const TEXT_ALIGN_RIGHT = "text-right";

const TEXT_SIZE_9XL = "text-9xl";
const TEXT_SIZE_8XL = "text-8xl";
const TEXT_SIZE_7XL = "text-7xl";
const TEXT_SIZE_6XL = "text-6xl";
const TEXT_SIZE_5XL = "text-5xl";
const TEXT_SIZE_4XL = "text-4xl";
const TEXT_SIZE_3XL = "text-3xl";
const TEXT_SIZE_2XL = "text-2xl";
const TEXT_SIZE_XL = "text-xl";
const TEXT_SIZE_LG = "text-lg";
const TEXT_SIZE_BASE = "text-base";
const TEXT_SIZE_SM = "text-sm";
const TEXT_SIZE_XS = "text-xs";

type TextSize =
  | typeof TEXT_SIZE_9XL
  | typeof TEXT_SIZE_8XL
  | typeof TEXT_SIZE_7XL
  | typeof TEXT_SIZE_6XL
  | typeof TEXT_SIZE_5XL
  | typeof TEXT_SIZE_4XL
  | typeof TEXT_SIZE_3XL
  | typeof TEXT_SIZE_2XL
  | typeof TEXT_SIZE_XL
  | typeof TEXT_SIZE_LG
  | typeof TEXT_SIZE_BASE
  | typeof TEXT_SIZE_SM
  | typeof TEXT_SIZE_XS;

type TextColor = typeof TEXT_BLACK | typeof TEXT_RED;
type TextAlign =
  | typeof TEXT_ALIGN_LEFT
  | typeof TEXT_ALIGN_CENTER
  | typeof TEXT_ALIGN_RIGHT;

type Props = {
  HeadingBlock: {
    title: string;
    textAlign: TextAlign;
    textColor: TextColor;
    textSize: TextSize;
  };
  SubTitleBlock: { title: string };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
        textAlign: {
          type: "select",
          options: [
            { label: "Left", value: TEXT_ALIGN_LEFT },
            { label: "Center", value: TEXT_ALIGN_CENTER },
            { label: "Right", value: TEXT_ALIGN_RIGHT },
          ],
        },
        textColor: {
          type: "select",
          options: [
            { label: "Black", value: TEXT_BLACK },
            { label: "Primary", value: TEXT_RED },
          ],
        },
        textSize: {
          type: "select",
          options: [
            { label: "9XL", value: TEXT_SIZE_9XL },
            { label: "8XL", value: TEXT_SIZE_8XL },
            { label: "7XL", value: TEXT_SIZE_7XL },
            { label: "6XL", value: TEXT_SIZE_6XL },
            { label: "5XL", value: TEXT_SIZE_5XL },
            { label: "4XL", value: TEXT_SIZE_4XL },
            { label: "3XL", value: TEXT_SIZE_3XL },
            { label: "2XL", value: TEXT_SIZE_2XL },
            { label: "XL", value: TEXT_SIZE_XL },
            { label: "LG", value: TEXT_SIZE_LG },
            { label: "BASE", value: TEXT_SIZE_BASE },
            { label: "SM", value: TEXT_SIZE_SM },
            { label: "XS", value: TEXT_SIZE_XS },
          ],
        },
      },
      defaultProps: {
        title: "Heading",
        textAlign: TEXT_ALIGN_LEFT,
        textColor: TEXT_BLACK,
        textSize: TEXT_SIZE_7XL,
      },
      render: ({ title, textAlign, textColor, textSize }) => (
        <MenuTitleBlock
          text={title}
          textAlign={textAlign}
          textColor={textColor}
          textSize={textSize}
        />
      ),
    },
    SubTitleBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "SubTitle",
      },
      render: ({ title }) => (
        <div className="p-16 text-gray-500">
          <h1>{title}</h1>
        </div>
      ),
    },
  },
};

const textAlignClasses = {
  "text-left": "text-left",
  "text-center": "text-center",
  "text-right": "text-right",
};

const textColorClasses = {
  "text-black": "text-black",
  "text-red-900": "text-red-900",
};

const textSizeClasses = {
  "text-9xl": "text-9xl",
  "text-8xl": "text-8xl",
  "text-7xl": "text-7xl",
  "text-6xl": "text-6xl",
  "text-5xl": "text-5xl",
  "text-4xl": "text-4xl",
  "text-3xl": "text-3xl",
  "text-2xl": "text-2xl",
  "text-xl": "text-xl",
  "text-lg": "text-lg",
  "text-base": "text-base",
  "text-sm": "text-sm",
  "text-xs": "text-xs",
};

const MenuTitleBlock = ({
  text = "text",
  textAlign = TEXT_ALIGN_LEFT,
  textColor = TEXT_BLACK,
  textSize = TEXT_SIZE_BASE,
}) => {
  const alignClass =
    textAlignClasses[textAlign as TextAlign] || TEXT_ALIGN_LEFT;
  const colorClass = textColorClasses[textColor as TextColor] || TEXT_BLACK;
  const sizeClass = textSizeClasses[textSize as TextSize] || TEXT_SIZE_BASE;
  return (
    <div className={`${alignClass} w-full ${colorClass} ${sizeClass}`}>
      {text}
    </div>
  );
};

export default config;
