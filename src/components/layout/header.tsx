import { auth, signIn, signOut } from "@/server/auth";

export const Header = async () => {
  const session = await auth();
  console.log("session", session);

  return (
    <div className="flex gap-4">
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
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Logout</button>
        </form>
      )}
      {session && <div>User ID: {session.user.email}</div>}
    </div>
  );
};
