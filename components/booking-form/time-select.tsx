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

  /**
   * TODO:
   * - improve data structures
   */

  // Map
  //   - key: time
  //   - value: machineList
  //     - machineList: Map<string, { name: string; available: boolean }>

  // processedTimes
  //   loop through Map and calculate available machines
  //   then render list

  // processedMachines
  //   convert this to lookup map key
  //     ie. Map.get(time) => machineList
  //   then render list
  const processedMachines = timesAndMachines.filter((tm) =>
    isSameMinute(tm.time, selectedTime)
  )[0]?.machineList;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* {processedTimes.map(({ time, availableMachines }) => (
          <button
            key={time.toISOString()}
            className={isSameMinute(selectedTime, time) ? "text-blue-500" : ""}
            onClick={() => setSelectedTime(time)}
          >
            {format(time, "h:mm aaa")} ({availableMachines} available)
          </button>
        ))} */}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* {processedMachines.map((machine) => (
          <button
            key={machine.Uuid}
            className={machine.available ? "text-green-500" : "text-red-500"}
          >
            {machine.Name}
          </button>
        ))} */}
      </div>
    </>
  );
}
