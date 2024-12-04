"use client";

import { api } from "@/trpc/react";
import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import config from "puck.config";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const createPage = api.puck.editPage.useMutation({
    onSuccess: () => {
      console.log("Success");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const onPublish = async (data: Data) => {
    createPage.mutate({ path, data });
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
