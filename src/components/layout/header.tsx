import { auth, signIn, signOut } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = async () => {
  const session = await auth();
  console.log("session", session);

  return (
    <div className="sticky left-0 right-0 top-0 flex h-[100px] items-center justify-between border border-b-stone-200 bg-stone-100 px-8 py-4">
      <div className="text-2xl font-bold">Plate-Play</div>

      {!session?.user.email && (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      )}
      {session?.user.id && (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) ?? "A"}
            </AvatarFallback>
          </Avatar>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </div>
      )}
    </div>
  );
};
