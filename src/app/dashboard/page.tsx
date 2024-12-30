import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import PlateList from "./plate-list";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const allPlate = await api.plate.getAllPlates({
    userId,
  });
  return (
    <div className="container mx-auto pb-8 pt-14">
      <Suspense fallback={<div>Loading...</div>}>
        <PlateList plates={allPlate} userId={userId} />
      </Suspense>
    </div>
  );
}
