import { ColorPicker } from "@/components/puck/color-picker";
import { TextBlock } from "@/components/puck/text-block";
import {
  FONT_WEIGHT_CLASSES,
  FONT_WEIGHTS,
  type FontWeight,
  PADDING_CLASSES,
  PADDINGS,
  TEXT_ALIGN_CLASSES,
  TEXT_ALIGNS,
  TEXT_SIZE_CLASSES,
  TEXT_SIZES,
  type Padding,
  type TextAlign,
  type TextSize,
} from "@/constants/styles";
import { FieldLabel, type Config } from "@measured/puck";

type Props = {
  TextBlock: {
    title: string;
    textAlign: TextAlign;
    textColor: string;
    textSize: TextSize;
    padding: Padding;
    bgColor: string;
    fontWeight: FontWeight;
  };
};

const labelize = (str: string, removeString = "") => {
  if (!str) return "";
  const modifiedStr = str.replace(removeString, "");
  return modifiedStr.charAt(0).toUpperCase() + modifiedStr.slice(1);
};

export const config: Config<Props> = {
  categories: {
    typography: {
      components: ["TextBlock"],
    },
  },
  components: {
    TextBlock: {
      fields: {
        title: {
          label: "テキスト(Text)",
          type: "text",
        },
        textAlign: {
          label: "テキストの位置(Text Align)",
          type: "radio",
          options: TEXT_ALIGN_CLASSES.map((align) => ({
            label: labelize(align, "text-"),
            value: align,
          })),
        },
        textColor: {
          label: "テキストの色(Text Color)",
          type: "custom",
          render: ({ field: { label }, onChange, value }) => (
            <FieldLabel label={label!}>
              <ColorPicker value={value} onChange={onChange} />
            </FieldLabel>
          ),
        },
        bgColor: {
          label: "背景色(Background Color)",
          type: "custom",
          render: ({ field: { label }, onChange, value }) => (
            <FieldLabel label={label!}>
              <ColorPicker value={value} onChange={onChange} />
            </FieldLabel>
          ),
        },
        textSize: {
          label: "文字サイズ(Text Size)",
          type: "select",
          options: TEXT_SIZE_CLASSES.map((size) => ({
            label: size.replace("text-", ""),
            value: size,
          })),
        },
        padding: {
          label: "余白(Padding)",
          type: "select",
          options: PADDING_CLASSES.map((p) => ({
            label: p.replace("p-", ""),
            value: p,
          })),
        },
        fontWeight: {
          label: "フォントの太さ(Font Weight)",
          type: "select",
          options: FONT_WEIGHT_CLASSES.map((weight) => ({
            label: labelize(weight, "font-"),
            value: weight,
          })),
        },
      },
      defaultProps: {
        title: "text",
        textAlign: TEXT_ALIGNS.TEXT_ALIGN_LEFT,
        textColor: "#000000",
        textSize: TEXT_SIZES.TEXT_SIZE_7XL,
        padding: PADDINGS[16],
        bgColor: "#ffffff",
        fontWeight: FONT_WEIGHTS.NORMAL,
      },
      render: ({
        title,
        textAlign,
        textColor,
        textSize,
        padding,
        bgColor,
        fontWeight,
      }) => (
        <TextBlock
          text={title}
          textAlign={textAlign}
          textColor={textColor}
          textSize={textSize}
          padding={padding}
          bgColor={bgColor}
          fontWeight={fontWeight}
        />
      ),
    },
  },
};

export default config;
