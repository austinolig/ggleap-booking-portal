"use client";

import { calculateTimesAndMachines } from "@/lib/utils";
import { useSelectionStore } from "@/stores";
import { CenterInfo } from "@/types";
import { format, isSameMinute } from "date-fns";

type ProcessedMachine = {
  time: Date;
  availableMachines: number;
};

export default function TimeSelect({ centerInfo }: { centerInfo: CenterInfo }) {
  const selectedDate = useSelectionStore((state) => state.selectedDate);
  const selectedDuration = useSelectionStore((state) => state.selectedDuration);
  const selectedTime = useSelectionStore((state) => state.selectedTime);
  const setSelectedTime = useSelectionStore((state) => state.setSelectedTime);

  const timesAndMachines = calculateTimesAndMachines(
    centerInfo,
    selectedDate,
    selectedDuration
  );

  if (!timesAndMachines) {
    return <div>Error fetching times</div>;
  }

  console.log("timesAndMachines", timesAndMachines);

  const processedMachines = centerInfo.machines.map((machine) => {
    const available = !timesAndMachines.map
      .get(selectedTime.toISOString())
      ?.has(machine.Uuid);

    return {
      ...machine,
      available,
    };
  });

  const processedTimes: ProcessedMachine[] = [];
  timesAndMachines.map.forEach((value: Set<string>, key: string) => {
    processedTimes.push({
      time: new Date(key),
      availableMachines: centerInfo.machines.length - value.size,
    });
  });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {processedTimes.map(({ time, availableMachines }) => (
          <button
            key={time.toISOString()}
            className={isSameMinute(selectedTime, time) ? "text-blue-500" : ""}
            onClick={() => setSelectedTime(time)}
          >
            {format(time, "h:mm aaa")} ({availableMachines} available)
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {processedMachines.map((machine) => (
          <button
            key={machine.Uuid}
            className={machine.available ? "text-green-500" : "text-red-500"}
          >
            {machine.Name}
          </button>
        ))}
      </div>
    </>
  );
}
