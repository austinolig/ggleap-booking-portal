"use client";

import { useSelectionStore } from "@/stores";
import OptionButton from "../option-button";

export default function DurationSelect() {
  const selectedDuration = useSelectionStore((state) => state.selectedDuration);
  const setSelectedDuration = useSelectionStore(
    (state) => state.setSelectedDuration
  );
  const durations = [90, 60];

  return (
    <div className="flex flex-col gap-3">
      <p>Duration</p>
      <div className="grid grid-cols-2 gap-3">
        {durations.map((duration) => (
          <OptionButton
            key={duration.toString()}
            onClick={() => setSelectedDuration(duration)}
            selected={selectedDuration === duration}
          >
            {duration} Minutes
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
