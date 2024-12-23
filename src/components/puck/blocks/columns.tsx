import type { ComponentConfig } from "@measured/puck";
import { DropZone } from "@measured/puck";
import { spacingOptions } from "@/constants/spacing-options";
import { generateId } from "@/lib/generate-id";

export type ColumnsProps = {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
    id?: string;
  }[];
  gap: string;
  padding: string;
  innerPadding: string;
};

export const Columns: ComponentConfig<ColumnsProps> = {
  resolveData: ({ props }, { lastData }) => {
    if (lastData?.props.columns.length === props.columns.length) {
      return { props };
    }

    return {
      props: {
        ...props,
        columns: props.columns.map((column) => ({
          ...column,
          id: column.id ?? generateId(),
        })),
      },
    };
  },
  fields: {
    distribution: {
      type: "radio",
      options: [
        {
          value: "auto",
          label: "Auto",
        },
        {
          value: "manual",
          label: "Manual",
        },
      ],
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
    innerPadding: {
      type: "select",
      label: "Inner Padding(内部間隔)",
      options: spacingOptions,
    },
    columns: {
      type: "array",
      getItemSummary: (col) =>
        `Column (span ${
          col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"
        })`,
      arrayFields: {
        span: {
          label: "Span (1-12)",
          type: "number",
          min: 0,
          max: 12,
        },
      },
    },
  },
  defaultProps: {
    gap: "8px",
    padding: "8px",
    innerPadding: "8px",
    distribution: "auto",
    columns: [{}, {}],
  },
  render: ({ columns, gap, padding, innerPadding, distribution }) => {
    return (
      <div className="mx-auto w-full">
        <div
          className="gap flex min-h-0 min-w-0 flex-col md:grid"
          style={{
            padding,
            gap,
            gridTemplateColumns:
              distribution === "manual"
                ? "repeat(12, 1fr)"
                : `repeat(${columns.length}, 1fr)`,
          }}
        >
          {columns.map(({ span, id }, idx) => (
            <div
              key={id ?? idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gridColumn:
                  span && distribution === "manual"
                    ? `span ${Math.max(Math.min(span, 12), 1)}`
                    : "",
              }}
            >
              <DropZone
                zone={`column-${id ?? idx}`}
                style={{ padding: innerPadding }}
                // TODO: disallowの設定を追加
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
