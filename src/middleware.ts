import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const res = NextResponse.next();

  if (req.method === "GET") {
    console.log("Middleware executing for path:", req.nextUrl.pathname);

    // Rewrite routes that match "/[...platePath]/edit" to "/plate/[...platePath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      //login user check (next auth5 session)
      if (!req.auth) {
        console.log("unauthenticated user");
      } else {
        // url pathがdashboardの場合はblockする
        // TODO dashboardという名前は登録できないことを知らせるページ作成してリダイレクト
        if (req.nextUrl.pathname === "/dashboard/edit") {
          return NextResponse.redirect(new URL("/", req.url));
        }

        console.log("authenticated user");
      }

      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5,
      );
      const pathWithEditPrefix = `/plate${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // "/plate/[...platePath]"
    if (req.nextUrl.pathname.startsWith("/plate")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
});

export const config = {
  matcher: ["/plate/:path*", "/:path*/edit"],
};
