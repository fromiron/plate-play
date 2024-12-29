import type { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { spacingOptions } from "@/constants/spacing-options";
import {
  CONTENT_ALIGN_CLASSES,
  CONTENT_ALIGNS,
  type ContentAlign,
} from "@/constants/styles";
import { labelize } from "@/lib/utils";

export type FlexProps = {
  items: { minItemWidth?: number }[];
  minItemWidth: number;
  gap: string;
  padding: string;
  contentAlign: ContentAlign;
};

export const Flex: ComponentConfig<FlexProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        minItemWidth: {
          label: "Minimum Item Width",
          type: "number",
          min: 0,
        },
      },
      getItemSummary: (_, id = -1) => `Item ${id + 1}`,
    },
    minItemWidth: {
      label: "Minimum Item Width",
      type: "number",
      min: 0,
    },
    contentAlign: {
      label: "アイテムの位置(Text Align)",
      type: "select",
      options: CONTENT_ALIGN_CLASSES.map((align) => ({
        label: labelize(align),
        value: align,
      })),
    },
    gap: {
      type: "select",
      label: "Gap(カラム間隔)",
      options: spacingOptions,
    },
    padding: {
      type: "select",
      label: "Padding(外部間隔)",
      options: spacingOptions,
    },
  },
  defaultProps: {
    gap: "8px",
    padding: "8px",
    items: [{}, {}],
    minItemWidth: 356,
    contentAlign: CONTENT_ALIGNS.CENTER,
  },
  render: ({ items, gap, padding, minItemWidth, contentAlign }) => {
    return (
      <div className="mx-auto w-full">
        <div
          className={"flex flex-wrap"}
          style={{ gap, padding, justifyContent: contentAlign }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={"item"}
              style={{
                minWidth: item.minItemWidth ?? minItemWidth,
              }}
            >
              <DropZone zone={`item-${idx}`} />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
