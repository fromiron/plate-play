import {
  DEFAULT_COLORS,
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
import { ColorPicker } from "../../parts/color-picker";
export type TextBlockProps = {
  text: string;
  textAlign: TextAlign;
  textSize: TextSize;
  padding: Padding;
  colors: {
    textColor: string;
    bgColor: string;
  };
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
    colors: {
      label: "色(Color)",
      type: "custom",
      render: ({ field: { label }, onChange, value }) => (
        <FieldLabel label={label!}>
          <div className="flex space-x-4">
            <ColorPicker
              value={value?.textColor ?? DEFAULT_COLORS.BLACK}
              onChange={(newColor) => {
                onChange({ ...value, textColor: newColor });
              }}
              label="Text"
            />
            <ColorPicker
              value={value?.bgColor ?? DEFAULT_COLORS.WHITE}
              onChange={(newColor) => {
                onChange({ ...value, bgColor: newColor });
              }}
              label="BG"
            />
          </div>
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
    textSize: TEXT_SIZES.TEXT_SIZE_7XL,
    padding: PADDINGS[16],
    colors: {
      textColor: DEFAULT_COLORS.BLACK,
      bgColor: DEFAULT_COLORS.WHITE,
    },
    fontWeight: FONT_WEIGHTS.NORMAL,
  },
  render: ({
    text,
    textAlign,
    textSize,
    padding,
    fontWeight,
    colors: { textColor, bgColor } = {
      textColor: DEFAULT_COLORS.BLACK,
      bgColor: DEFAULT_COLORS.WHITE,
    },
  }) => (
    <div
      className={`w-full ${textAlign} ${textSize} ${String(padding)} ${fontWeight}`}
      style={{ color: textColor, backgroundColor: bgColor }}
    >
      {text}
    </div>
  ),
};
