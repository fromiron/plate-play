"use client";
import { useState } from "react";
import { PlateCard, type PlateCardProps } from "@/components/plate-card";
import { Input } from "@/components/ui/input";
import { AddPlateButton } from "./_components/add-plate-button";

export default function PlateList({
  plates,
  userId,
}: {
  plates: PlateCardProps[];
  userId: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlates = plates.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 border-b border-gray-200">
        <Input
          type="text"
          placeholder="Search plates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-4 ml-auto max-w-52"
        />
        <div className="w-fit select-none rounded-sm bg-primary px-4 py-2 text-white">
          <span className="text-md font-medium">{plates.length ?? 0}</span>
          <span className="text-[10px]">P</span>
        </div>
        <AddPlateButton userId={userId} />
      </div>
      <ul className="mx-8 grid grid-cols-1 gap-8 md:mx-0 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlates.map((plate) => (
          <PlateCard
            key={plate.path}
            title={plate.title}
            path={plate.path}
            updatedAt={plate.updatedAt}
          />
        ))}
      </ul>
    </div>
  );
}
