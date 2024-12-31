import "@/styles/puck-editor.css";
import { Client } from "./client";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";

type paramsType = Promise<{ platePath: string[] }>;

export default async function Page(props: { params: paramsType }) {
  const { platePath = [] } = await props.params;
  const session = await auth();

  // todo - add auth check
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const userId = session.user.id ?? "";
  const path = `/${platePath.join("/")}`;
  const pageData = await api.plate.getPlate({ path });
  return <Client userId={userId} path={path} data={pageData?.data ?? {}} />;
}

export const dynamic = "force-dynamic";
