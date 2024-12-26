import {
  BORDER_ROUNDED,
  BORDER_ROUNDED_CLASSES,
  DEFAULT_COLORS,
  PADDING_CLASSES,
  type BorderRounded,
  type Padding,
} from "@/constants/styles";
import { DropZone, FieldLabel, type ComponentConfig } from "@measured/puck";
import { ColorPicker } from "../../parts/color-picker";
import { cn, labelize } from "@/lib/utils";

export type ContainerProps = {
  padding: Padding;
  bgColor: string;
  borderRounded: BorderRounded;
};
export const Container: ComponentConfig<ContainerProps> = {
  fields: {
    padding: {
      label: "余白(Padding)",
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
    bgColor: DEFAULT_COLORS.TRANSPARENT,
    borderRounded: BORDER_ROUNDED.DEFAULT,
  },
  render: ({ padding, bgColor, borderRounded }) => {
    return (
      <div
        className={cn(
          padding,
          borderRounded,
          "flex h-auto w-full flex-col items-center justify-center",
        )}
        style={{ backgroundColor: bgColor }}
      >
        <DropZone zone={"container"} />
      </div>
    );
  },
};
