import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import { AddPlateButton } from "./_components/add-plate-button";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const allPlate = await api.plate.getAllPlates({
    userId,
  });
  console.log(allPlate);
  return (
    <main className="w-full bg-red-500">
      <h1>Dashboard</h1>
      <ul>
        {allPlate.map((plate) => {
          return (
            <li key={plate.path} className="flex gap-4">
              <Link href={plate.path} target="_blank">
                {plate.path}
              </Link>
              <Link href={`${plate.path}/edit`} target="_blank">
                edit
              </Link>
            </li>
          );
        })}
        <li>
          <AddPlateButton userId={userId} />
        </li>
      </ul>
    </main>
  );
}
