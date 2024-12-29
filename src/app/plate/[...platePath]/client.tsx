"use client";

import { api } from "@/trpc/react";
import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import config from "puck.config";

type ClientProps = {
  userId: string;
  path: string;
  data: Partial<Data>;
};

export function Client({ userId, path, data }: ClientProps) {
  const createPlate = api.plate.editPlate.useMutation({
    onSuccess: () => {
      console.log("Success");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });
  const plateTitle = data.root?.title ?? "New Page";
  const onPublish = async (data: Data) => {
    createPlate.mutate({ userId, path, data, plateTitle });
  };

  return (
    <Puck
      config={config}
      data={data}
      onPublish={async (data) => {
        await onPublish(data);
      }}
    />
  );
}
