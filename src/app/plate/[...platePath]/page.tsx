import "@/styles/puck-editor.css";
import { Client } from "./client";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";

export default async function Page({
  params,
}: {
  params: { platePath?: string[] };
}) {
  const { platePath = [] } = await Promise.resolve(params);
  const session = await auth();

  // todo - add auth check
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const userId = session.user.id ?? "";

  const path = `/${session.user.id}/${platePath.join("/")}`;
  const pageData = await api.plate.getPage({ path });
  return <Client userId={userId} path={path} data={pageData?.data ?? {}} />;
}

export const dynamic = "force-dynamic";
