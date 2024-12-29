import { auth, signIn, signOut } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <main>
      {!session?.user.id && (
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
      {session?.user.id && <p>User ID: {session.user.id}</p>}
    </main>
  );
}
