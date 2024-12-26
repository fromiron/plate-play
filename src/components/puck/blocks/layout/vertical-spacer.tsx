import { spacingOptions } from "@/constants/spacing-options";
import { FieldLabel, type ComponentConfig } from "@measured/puck";
import { ColorPicker } from "../../parts/color-picker";
import {
  DEFAULT_COLORS,
  MARGIN_BOTTOM,
  MARGIN_TOP,
  type MarginBottom,
  type MarginTop,
} from "@/constants/styles";
import { cn } from "@/lib/utils";

export type SpacerProps = {
  size: string;
  bgColor: string;
  marginTop: MarginTop;
  marginBottom: MarginBottom;
};

export const VerticalSpacer: ComponentConfig<SpacerProps> = {
  label: "VerticalSpacer",
  fields: {
    size: {
      label: "サイズ(Size)",
      type: "select",
      options: spacingOptions,
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
  },
  defaultProps: {
    size: "24px",
    bgColor: DEFAULT_COLORS.WHITE,
    marginTop: MARGIN_TOP["0PX"],
    marginBottom: MARGIN_BOTTOM["0PX"],
  },
  render: ({ size, bgColor, marginTop, marginBottom }) => {
    return (
      <div
        style={{
          height: size,
          minHeight: "1px",
          backgroundColor: bgColor,
        }}
        className={cn(marginTop, marginBottom, "w-full")}
      />
    );
  },
};
