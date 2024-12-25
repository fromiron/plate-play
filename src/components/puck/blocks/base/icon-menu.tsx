import { Icon } from "@/components/ui/icon";
import {
  ICON_LIST,
  ICON_STYLES,
  ICONS,
  type IconType,
} from "@/constants/icons";
import {
  type Direction,
  DIRECTIONS,
  TEXT_SIZE_CLASSES,
  TEXT_SIZES,
} from "@/constants/styles";
import { cn } from "@/lib/utils";
import type { ComponentConfig } from "@measured/puck";
import type { IconWeight } from "@phosphor-icons/react/dist/lib/types";

export type IconMenuProps = {
  icon: IconType;
  iconSize: number;
  iconStyle: IconWeight;
  title: string;
  titleSize: string;
  description: string;
  descriptionSize: string;
  price: number;
  priceSize: string;
  direction: Direction;
};

export const IconMenu: ComponentConfig<IconMenuProps> = {
  fields: {
    icon: {
      label: "アイコン",
      type: "select",
      options: Object.entries(ICON_LIST).map(([key]) => ({
        label: ICONS[key as IconType].name,
        value: key,
      })),
    },
    iconSize: {
      label: "アイコンサイズ",
      type: "number",
      min: 8,
    },
    iconStyle: {
      label: "アイコンスタイル",
      type: "select",
      options: Object.entries(ICON_STYLES).map(([key, value]) => ({
        label: key,
        value: value,
      })),
    },
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
  defaultProps: {
    icon: ICON_LIST.BOWL,
    iconSize: 48,
    iconStyle: ICON_STYLES.REGULAR!,
    title: "Text",
    titleSize: TEXT_SIZES.TEXT_SIZE_LG,
    description: "Description",
    descriptionSize: TEXT_SIZES.TEXT_SIZE_BASE,
    direction: DIRECTIONS.HORIZONTAL as Direction,
    price: 0,
    priceSize: TEXT_SIZES.TEXT_SIZE_BASE,
  },
  render: ({
    icon,
    iconSize,
    iconStyle,
    title,
    titleSize,
    description,
    descriptionSize,
    direction,
    price,
    priceSize,
  }) => {
    const isVertical = direction === "vertical";
    return (
      <div
        className={cn(
          "flex",
          { "flex-col": isVertical },
          "items-center gap-4 p-4",
        )}
      >
        <Icon icon={icon} size={iconSize} weight={iconStyle} />
        <div>
          <div className={cn(titleSize, "font-bold")}>{title}</div>
          <div className={descriptionSize}>{description}</div>
          <div className={cn(priceSize, "font-medium")}>¥{price}</div>
        </div>
      </div>
    );
  },
};
