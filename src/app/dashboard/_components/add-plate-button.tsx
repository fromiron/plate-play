"use client";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/generate-id";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
type Props = {
  userId: string;
};

export const AddPlateButton = ({ userId }: Props) => {
  const router = useRouter();
  const onClick = () => {
    const plateId = generateId(10);
    router.push(`/${userId}/${plateId}/edit`);
  };
  return (
    <>
      <Button onClick={onClick} variant="ghost">
        <Plus weight="bold" size={32} />
        Plate
      </Button>
    </>
  );
};
