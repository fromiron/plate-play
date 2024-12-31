import { auth, signIn, signOut } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { CookingPot } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const Header = async ({ isWide = false }: { isWide?: boolean }) => {
  const session = await auth();
  const containerClass = isWide ? "mx-4" : "container";

  return (
    <header className="fixed top-0 w-full border-b border-secondary bg-white/60 backdrop-blur-md">
      <nav
        className={`${containerClass} mx-auto flex justify-between px-4 py-2 md:px-0`}
      >
        <Link href={"/"} className="flex select-none items-center space-x-2">
          <CookingPot className="h-6 w-6" />
          <span className="text-xl font-bold">PlatePlay</span>
        </Link>

        {!session?.user.email && (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button variant="ghost" type="submit" size="sm">
              Log in
            </Button>
          </form>
        )}

        {session?.user.id && (
          <div className="flex items-center gap-4">
            <Link href={"/dashboard"} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) ?? "A"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" variant="ghost">
                Logout
              </Button>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
};
