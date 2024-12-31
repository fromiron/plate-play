import { ICONS, type Icon as IconType } from "@/constants/icons";
import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react/dist/lib/types";
import { BowlFood } from "@phosphor-icons/react/dist/ssr";

type IconProps = PhosphorIconProps & {
  icon: IconType;
};

export const Icon = ({ icon, ...props }: IconProps) => {
  const IconComponent = ICONS[icon]?.icon || BowlFood;
  return <IconComponent {...props} />;
};
