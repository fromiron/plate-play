import type { Data } from "@measured/puck";

/**
 * This file implements a *magic* catch-all route that renders the plate editor.
 *
 * This route exposes /plate/[...platePath], but is disabled by middleware.ts. The middleware
 * then rewrites all URL requests ending in `/edit` to this route, allowing you to visit any
 * page in your application and add /edit to the end to spin up a plate editor.
 *
 * This approach enables public pages to be statically rendered whilst the /plate route can
 * remain dynamic.
 *
 * NB this route is public, and you will need to add authentication
 */

import "@measured/puck/puck.css";
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
  console.log("path", path);

  const pageData = await api.plate.getPage({ path });
  console.log(
    "-----------------------AAAAAAAAAAAAAAA-----------------------",
    pageData,
  );
  return (
    <div>
      <div>Create, Update</div>
      <Client userId={userId} path={path} data={pageData?.data ?? {}} />
    </div>
  );
}

export const dynamic = "force-dynamic";
