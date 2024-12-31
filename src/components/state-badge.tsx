import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export const StateBadge = ({
  state,
  className,
}: {
  state: boolean;
  className?: string;
}) => {
  return (
    <Badge
      variant={state ? "default" : "destructive"}
      className={cn(className, "select-none")}
    >
      {state ? "公開" : "下書き"}
    </Badge>
  );
};
