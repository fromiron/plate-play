// import type { Data } from "@measured/puck";
// import fs from "fs";

// // Replace with call to your database
// export const getPage = (path: string) => {
//   const allData: Record<string, Data> | null = fs.existsSync("database.json")
//     ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
//     : null;

//   return allData ? allData[path] : null;
// };

import type { Data } from "@measured/puck";
import { createCaller } from "@/server/api/root";

export const getPage = (path: string) => {
  const caller = await createCaller();
  const page = await caller.page.getPage({ path });

  return page as Data;
};
