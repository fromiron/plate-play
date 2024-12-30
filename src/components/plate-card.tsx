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
  QrCode,
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

export type PlateCardProps = Pick<Plate, "title" | "path" | "updatedAt">;
export const PlateCard = ({ title, path, updatedAt }: PlateCardProps) => {
  return (
    <Card className="hover:shadow-xl">
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
        <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-xl">
          <div className="absolute inset-0 z-10 flex select-none flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
            <div className="mt-8 text-lg text-white">View</div>
            <EyeClosed size={32} className="text-white/80" />
          </div>

          <Image
            src="https://picsum.photos/288/192"
            alt="Plate Play Interface Demo"
            height={192}
            width={288}
            className="h-48 w-full object-cover"
          />
        </div>
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
              <div className="flex h-full w-full cursor-pointer items-center gap-2">
                <Trash size={32} />
                Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild variant={"link"} size={"icon"} className="">
                <QrCode size={32} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>ページURLをQRCodeで作成できます</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
