import { auth, signIn, signOut } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { CookingPot } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const Header = async () => {
  const session = await auth();
  console.log("session", session);

  return (
    <header className="fixed top-0 w-full bg-white/20">
      <nav className="container mx-auto flex justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <CookingPot className="h-6 w-6" />
          <span className="text-xl font-bold">Plate Play</span>
        </div>

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
              <Button type="submit" size="sm">
                Logout
              </Button>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
};
