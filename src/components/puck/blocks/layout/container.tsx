import {
  BORDER_ROUNDED,
  BORDER_ROUNDED_CLASSES,
  DEFAULT_COLORS,
  PADDING_CLASSES,
  MARGIN_TOP,
  MARGIN_BOTTOM,
  MARGIN_LEFT,
  MARGIN_RIGHT,
} from "@/constants/styles";
import type {
  BorderRounded,
  Padding,
  MarginTop,
  MarginBottom,
  MarginLeft,
  MarginRight,
} from "@/constants/styles";
import { DropZone, FieldLabel, type ComponentConfig } from "@measured/puck";
import { ColorPicker } from "../../parts/color-picker";
import { cn, labelize } from "@/lib/utils";

export type ContainerProps = {
  padding: Padding;
  bgColor: string;
  borderRounded: BorderRounded;
  marginTop: MarginTop;
  marginBottom: MarginBottom;
  marginLeft: MarginLeft;
  marginRight: MarginRight;
};
export const Container: ComponentConfig<ContainerProps> = {
  fields: {
    padding: {
      label: "内部余白(Padding)",
      type: "select",
      options: PADDING_CLASSES.map((p) => ({
        label: p.replace("p-", ""),
        value: p,
      })),
    },
    bgColor: {
      label: "色(Color)",
      type: "custom",
      render: ({ field: { label }, onChange, value }) => (
        <FieldLabel label={label!}>
          <div className="flex space-x-4">
            <ColorPicker
              value={value ?? DEFAULT_COLORS.WHITE}
              onChange={onChange}
            />
          </div>
        </FieldLabel>
      ),
    },
    marginTop: {
      label: "トップマージン(Top Margin)",
      type: "select",
      options: Object.entries(MARGIN_TOP).map(([label, value]) => ({
        label: label.toLowerCase(),
        value,
      })),
    },
    marginBottom: {
      label: "ボトムマージン(Bottom Margin)",
      type: "select",
      options: Object.entries(MARGIN_BOTTOM).map(([label, value]) => ({
        label: label.toLowerCase(),
        value,
      })),
    },
    marginLeft: {
      label: "左マージン(Left Margin)",
      type: "select",
      options: Object.entries(MARGIN_LEFT).map(([label, value]) => ({
        label: label.toLowerCase(),
        value,
      })),
    },
    marginRight: {
      label: "右マージン(Right Margin)",
      type: "select",
      options: Object.entries(MARGIN_RIGHT).map(([label, value]) => ({
        label: label.toLowerCase(),
        value,
      })),
    },
    borderRounded: {
      label: "Border Rounded",
      type: "select",
      options: BORDER_ROUNDED_CLASSES.map((rounded) => ({
        label: labelize(rounded, "rounded-"),
        value: rounded,
      })),
    },
  },
  defaultProps: {
    padding: "p-4",
    bgColor: DEFAULT_COLORS.WHITE,
    borderRounded: BORDER_ROUNDED.DEFAULT,
    marginTop: MARGIN_TOP["0PX"],
    marginBottom: MARGIN_BOTTOM["0PX"],
    marginLeft: MARGIN_LEFT["0PX"],
    marginRight: MARGIN_RIGHT["0PX"],
  },
  render: ({
    padding,
    bgColor,
    borderRounded,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  }) => {
    return (
      <div
        className={cn(
          padding,
          borderRounded,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          "min-w-28",
        )}
        style={{ backgroundColor: bgColor }}
      >
        <DropZone zone={"container"} />
      </div>
    );
  },
};
