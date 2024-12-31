import type { Plate } from "@prisma/client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  EyeClosed,
  List,
  Notebook,
  Pen,
  QrCode as QrCodeIcon,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import Link from "next/link";
import { QRCode } from "./qr-code";
import { StateBadge } from "./state-badge";

import { ToggleState } from "./toggle-state";
import { useState } from "react";
import { DeleteCard } from "./delete-card";
import { cn } from "@/lib/utils";
import { ConditionalLink } from "./conditional-link";

export type PlateCardProps = Pick<
  Plate,
  "title" | "state" | "path" | "updatedAt"
> & { userId: string };

export const PlateCard = ({
  title,
  state,
  path,
  userId,
  updatedAt,
}: PlateCardProps) => {
  const [isPublished, setIsPublished] = useState(state);

  const handlePublishState = (newState: boolean) => {
    setIsPublished(newState);
  };
  return (
    <Card
      className={cn(
        isPublished ? "bg-white" : "bg-primary-foreground",
        "relative hover:shadow-xl",
      )}
    >
      <StateBadge state={isPublished} className={"absolute -right-2 top-2"} />
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Notebook size={32} />
            <div>{title}</div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs text-gray-300">
          <p className="mt-1">修正日:{updatedAt.toLocaleDateString()}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConditionalLink href={path} target="_blank" disabled={!isPublished}>
          <div className="group relative overflow-hidden rounded-lg shadow-xl">
            {isPublished ? (
              <div className="absolute inset-0 z-10 flex cursor-pointer select-none flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
                <div className="mt-8 text-lg text-white">View</div>
                <EyeClosed size={32} className="text-white/80" />
              </div>
            ) : null}
            <Image
              src="https://picsum.photos/288/192"
              alt="Plate Play Interface Demo"
              height={192}
              width={288}
              className="h-48 w-full object-cover"
            />
          </div>
        </ConditionalLink>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-300">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Button asChild variant={"link"} size={"icon"} className="">
              <List size={32} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="flex h-full w-full items-center gap-2"
                href={`${path}/edit`}
              >
                <Pen size={32} />
                <p>Edit</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ToggleState
                path={path}
                state={isPublished}
                userId={userId}
                handlePublishState={handlePublishState}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteCard path={path} userId={userId} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild variant={"link"} size={"icon"} className="">
                <QrCodeIcon size={32} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <QRCode path={path} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
