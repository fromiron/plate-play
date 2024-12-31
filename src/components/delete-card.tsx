"use client";
import { api } from "@/trpc/react";
import { Trash } from "@phosphor-icons/react/dist/ssr";

type Props = {
  path: string;
  userId: string;
};

export const DeleteCard = ({ path, userId }: Props) => {
  const deletePlate = api.plate.deletePlate.useMutation({
    onSuccess: () => {
      console.log("OK");
      window.location.reload();
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const onClick = () => {
    if (
      confirm("一度削除しますと元に戻すことはできません。本当に削除しますか？")
    ) {
      deletePlate.mutate({ path, userId });
    }
  };

  return (
    <div
      className="flex h-full w-full cursor-pointer items-center gap-2"
      onClick={onClick}
    >
      <Trash size={32} />
      Delete
    </div>
  );
};
