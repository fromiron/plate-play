/**
 * This file implements a *magic* catch-all route that renders the Puck editor.
 *
 * This route exposes /puck/[...puckPath], but is disabled by middleware.ts. The middleware
 * then rewrites all URL requests ending in `/edit` to this route, allowing you to visit any
 * page in your application and add /edit to the end to spin up a Puck editor.
 *
 * This approach enables public pages to be statically rendered whilst the /puck route can
 * remain dynamic.
 *
 * NB this route is public, and you will need to add authentication
 */

import "@measured/puck/puck.css";
import { Client } from "./client";
import { api } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: { puckPath?: string[] };
}) {
  const { puckPath = [] } = params;

  const path = `/${puckPath.join("/")}`;
  console.log("path", path);

  const data = await api.puck.getPage({ path });

  return (
    <div>
      {path}
      <div>src\app\puck\[...puckPath]\page.tsx</div>
      <Client path={path} data={data ?? {}} />
    </div>
  );
}

export const dynamic = "force-dynamic";
