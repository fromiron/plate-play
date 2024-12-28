import {
  type Direction,
  DIRECTIONS,
  TEXT_SIZE_CLASSES,
} from "@/constants/styles";
import { generateId } from "@/lib/generate-id";
import { cn } from "@/lib/utils";
import { type ComponentConfig } from "@measured/puck";

export type TextMenuList = {
  title: string;
  titleSize: string;
  description: string;
  descriptionSize: string;
  direction: Direction;
  price: number;
  priceSize: string;
};

export type TextMenuListProps = {
  textMenuItems: TextMenuList[];
};

// TODO スタイルは全体的に変更できるようにする
// 共通スタイルを継承して個別変更できるよう修正
export const TextMenuList: ComponentConfig<TextMenuListProps> = {
  fields: {
    textMenuItems: {
      type: "array",
      arrayFields: {
        title: {
          label: "タイトル",
          type: "text",
        },
        titleSize: {
          label: "文字サイズ(Title Size)",
          type: "select",
          options: TEXT_SIZE_CLASSES.map((size) => ({
            label: size.replace("text-", ""),
            value: size,
          })),
        },
        description: {
          label: "説明",
          type: "text",
        },
        descriptionSize: {
          label: "文字サイズ(Description Size)",
          type: "select",
          options: TEXT_SIZE_CLASSES.map((size) => ({
            label: size.replace("text-", ""),
            value: size,
          })),
        },
        direction: {
          label: "方向",
          type: "radio",
          options: [
            { label: "縦", value: DIRECTIONS.VERTICAL },
            { label: "横", value: DIRECTIONS.HORIZONTAL },
          ],
        },
        price: {
          label: "価格",
          type: "number",
          min: 0,
        },
        priceSize: {
          label: "価格サイズ(Price Size)",
          type: "select",
          options: TEXT_SIZE_CLASSES.map((size) => ({
            label: size.replace("text-", ""),
            value: size,
          })),
        },
      },
    },
  },
  defaultProps: {
    textMenuItems: [
      {
        title: "メニュー",
        titleSize: "text-lg",
        description: "説明",
        descriptionSize: "text-sm",
        direction: DIRECTIONS.VERTICAL,
        price: 100,
        priceSize: "text-lg",
      },
    ],
  },
  render: ({ textMenuItems }) => {
    return (
      <ul>
        {textMenuItems.map((item) => {
          const {
            title = "メニュー",
            titleSize,
            description = "説明",
            descriptionSize,
            direction,
            price = "100",
            priceSize,
          } = item;
          const isVertical = direction === "vertical";
          const uid = generateId();
          return (
            <div
              key={`menu-item-${uid}`}
              className={cn("flex flex-col items-center gap-4 p-4")}
            >
              <div className="flex gap-2">
                <div className={cn(titleSize, "font-bold")}>{title}</div>
                <div className={descriptionSize}>{description}</div>
                {isVertical && (
                  <div className={cn(priceSize, "font-medium")}>¥{price}</div>
                )}
              </div>
              {!isVertical && (
                <div className={cn(priceSize, "font-medium")}>¥{price}</div>
              )}
            </div>
          );
        })}
      </ul>
    );
  },
};
