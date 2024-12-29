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
  const createPage = api.plate.editPage.useMutation({
    onSuccess: () => {
      console.log("Success");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const onPublish = async (data: Data) => {
    createPage.mutate({ userId, path, data });
  };

  return (
    <Puck
      headerTitle={"Plate Editor"}
      config={config}
      data={data}
      onPublish={async (data) => {
        await onPublish(data);
      }}
    />
  );
}
