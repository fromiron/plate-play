import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const res = NextResponse.next();

  if (req.method === "GET") {
    console.log("Middleware executing for path:", req.nextUrl.pathname);

    const { pathname } = req.nextUrl;

    // Rewrite routes that match "/[...platePath]/edit" to "/plate/[...platePath]"
    if (pathname.endsWith("/edit")) {
      const userId = req.auth?.user?.id;
      //login user check (next auth5 session)
      if (!userId) {
        console.log("unauthenticated user");
      } else {
        // url pathがdashboardの場合はblockする
        // TODO dashboardという名前は登録できないことを知らせるページ作成してリダイレクト
        if (pathname === "/dashboard/edit") {
          return NextResponse.redirect(new URL("/", req.url));
        }
        // pathに/editを含む場合req.auth?.user?.idがpathに含まれていない場合はblock
        // `/${userId}/${string}/edit`の形のみ許可
        if (!pathname.includes(userId)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      const pathWithoutEdit = pathname.slice(0, pathname.length - 5);
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
