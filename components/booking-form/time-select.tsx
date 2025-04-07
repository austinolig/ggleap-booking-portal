"use client";

import { calculateTimeSlots } from "@/lib/utils";
import { useSelectionStore } from "@/stores";
import { CenterInfo } from "@/types";
import { format } from "date-fns";

export default function TimeSelect({ centerInfo }: { centerInfo: CenterInfo }) {
  const selectedDate = useSelectionStore((state) => state.selectedDate);
  const selectedDuration = useSelectionStore((state) => state.selectedDuration);
  const selectedTimeSlot = useSelectionStore((state) => state.selectedTimeSlot);
  const setSelectedTimeSlot = useSelectionStore(
    (state) => state.setSelectedTimeSlot
  );
  const bookMachine = useSelectionStore((state) => state.bookMachine);

  const timeSlots = calculateTimeSlots(
    centerInfo,
    selectedDate,
    selectedDuration
  );

  if (!timeSlots) {
    return <div>Error: timeSlots</div>;
  }

  const machines = timeSlots[selectedTimeSlot]?.machineList;

  if (!machines) {
    return <div>Error: machines</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {Object.keys(timeSlots).map((timeSlot) => (
          <button
            key={timeSlot}
            className={`${selectedTimeSlot === timeSlot ? "text-blue-500" : ""}
              ${
                timeSlots[timeSlot].availableMachinesCount > 0
                  ? "text-green-500"
                  : "text-red-500"
              }
              `}
            onClick={() => setSelectedTimeSlot(timeSlot)}
            disabled={timeSlots[timeSlot].availableMachinesCount === 0}
          >
            {format(new Date(timeSlot), "h:mm aaa")} (
            {timeSlots[timeSlot].availableMachinesCount} available){" "}
            {selectedTimeSlot === timeSlot && "*"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {machines.map((machine) => (
          <button
            key={machine.Uuid}
            className={machine.Available ? "text-green-500" : "text-red-500"}
            onClick={() => bookMachine(machine.Uuid)}
            disabled={!machine.Available}
          >
            {machine.Name}
          </button>
        ))}
      </div>
    </>
  );
}
