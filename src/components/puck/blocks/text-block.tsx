import {
  FONT_WEIGHT_CLASSES,
  FONT_WEIGHTS,
  type FontWeight,
  type Padding,
  PADDING_CLASSES,
  PADDINGS,
  TEXT_ALIGN_CLASSES,
  TEXT_ALIGNS,
  TEXT_SIZE_CLASSES,
  TEXT_SIZES,
  type TextAlign,
  type TextSize,
} from "@/constants/styles";
import { labelize } from "@/lib/utils";
import { type ComponentConfig, FieldLabel } from "@measured/puck";
import { ColorPicker } from "../parts/color-picker";
export type TextBlockProps = {
  text: string;
  textAlign: TextAlign;
  textColor: string;
  textSize: TextSize;
  padding: Padding;
  bgColor: string;
  fontWeight: FontWeight;
};

export const TextBlock: ComponentConfig<TextBlockProps> = {
  fields: {
    text: {
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
    text: "text",
    textAlign: TEXT_ALIGNS.TEXT_ALIGN_LEFT,
    textColor: "rgba(0, 0, 0, 1)",
    textSize: TEXT_SIZES.TEXT_SIZE_7XL,
    padding: PADDINGS[16],
    bgColor: "rgba(255, 255, 255, 1)",
    fontWeight: FONT_WEIGHTS.NORMAL,
  },
  render: ({
    text,
    textAlign,
    textColor,
    textSize,
    padding,
    bgColor,
    fontWeight,
  }) => (
    <div
      className={`w-full ${textAlign} ${textSize} ${String(padding)} ${fontWeight}`}
      style={{ color: textColor, backgroundColor: bgColor }}
    >
      {text}
    </div>
  ),
};
