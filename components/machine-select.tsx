"use client";

import { useSelectedStore } from "@/stores";
import { Machine } from "@/types";

export default function MachineSelect({
  allMachines,
}: {
  allMachines: Machine[];
}) {
  // const overlaps = useSelectedStore((state) => state.overlaps);
  const selectedTime = useSelectedStore((state) => state.selectedTime);

  // const processedMachines = allMachines.map((machine) => {
  //   const isAvailable = !overlaps
  //     .get(selectedTime.toISOString())
  //     ?.has(machine.Uuid);

  //   return {
  //     ...machine,
  //     isAvailable,
  //   };
  // });
  return (
    <div className="flex flex-col gap-2">
      {/* {processedMachines.map((machine) => (
        <button
          key={machine.Uuid}
          className={!machine.isAvailable ? "text-muted" : ""}
        >
          {machine.Name}
        </button>
      ))} */}
    </div>
  );
}
