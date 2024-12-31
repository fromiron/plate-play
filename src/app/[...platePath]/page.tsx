/**
 * This file implements a catch-all route that renders the user-facing pages
 * generated by plate. For any route visited (with exception of other hardcoded
 * pages in /app), it will check your database (via `getPage`) for a plate page
 * and render it using <Render>.
 *
 * All routes produced by this page are statically rendered using incremental
 * static site generation. After the first visit, the page will be cached as
 * a static file. Subsequent visits will receive the cache. Publishing a page
 * will invalidate the cache as the page is written in /api/plate/route.ts
 */

import { Client } from "./client";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

type paramsType = Promise<{ platePath: string[] }>;

export default async function Page(props: { params: paramsType }) {
  const { platePath = [] } = await props.params;

  const path = `/${platePath.join("/")}`;

  const session = await auth();
  console.log("session", session);
  const pageData = await api.plate.getPlate({ path });

  if (!pageData?.data) {
    return notFound();
  }
  console.log("-----------------------BBBBBBBBBBBBBBB-----------------------");

  return (
    <div>
      <Client data={pageData.data} />
    </div>
  );
}

// Force Next.js to produce static pages: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// Delete this if you need dynamic rendering, such as access to headers or cookies
export const dynamic = "force-static";
