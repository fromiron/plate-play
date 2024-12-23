import { spacingOptions } from "@/constants/spacing-options";
import { FieldLabel, type ComponentConfig } from "@measured/puck";
import { ColorPicker } from "../../parts/color-picker";
import { DEFAULT_COLORS } from "@/constants/styles";

export type SpacerProps = {
  size: string;
  bgColor: string;
};

export const VerticalSpacer: ComponentConfig<SpacerProps> = {
  label: "VerticalSpacer",
  fields: {
    size: {
      label: "サイズ(Size)",
      type: "select",
      options: spacingOptions,
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
  },
  render: ({ size, bgColor }) => {
    return (
      <div
        style={{
          height: size,
          width: "100%",
          minHeight: "8px",
          backgroundColor: bgColor,
        }}
      />
    );
  },
};
