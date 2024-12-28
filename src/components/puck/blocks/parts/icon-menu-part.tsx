import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  iconMenuItemDefaultProps,
  type IconMenuItemProps,
} from "@/components/puck/blocks/base/icon-menu-item";

export const IconMenuPart = (props: IconMenuItemProps) => {
  const {
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
  } = { ...iconMenuItemDefaultProps, ...props };

  const isVertical = direction === "vertical";

  return (
    <div
      className={cn("flex items-center gap-4 p-4", { "flex-col": isVertical })}
    >
      <Icon icon={icon} size={iconSize} weight={iconStyle} />
      <div>
        <div className={cn(titleSize, "font-bold")}>{title}</div>
        <div className={cn(descriptionSize, "mt-4 max-w-72 break-words")}>
          {description}
        </div>
      </div>
      <div className={cn(priceSize, "font-medium")}>¥{price}</div>
    </div>
  );
};
