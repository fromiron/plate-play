"use client";
import { api } from "@/trpc/react";
import { ArrowsHorizontal } from "@phosphor-icons/react/dist/ssr";

type Props = {
  path: string;
  state: boolean;
  userId: string;
  handlePublishState: (newState: boolean) => void;
};

export const ToggleState = ({
  path,
  state,
  userId,
  handlePublishState,
}: Props) => {
  const toggleState = api.plate.changeState.useMutation({
    onSuccess: () => {
      console.log("OK");
      handlePublishState(!state);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const onClick = () => {
    toggleState.mutate({ path, state: !state, userId });
  };

  return (
    <div
      className="flex h-full w-full cursor-pointer items-center gap-2"
      onClick={onClick}
    >
      <ArrowsHorizontal size={32} />
      <p>{state ? "非公開" : "公開"}</p>
    </div>
  );
};
