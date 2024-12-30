"use client";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/generate-id";
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
      <Button onClick={onClick}>Add Plate</Button>
    </>
  );
};
