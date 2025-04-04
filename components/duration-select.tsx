"use client";

import { useSelectedStore } from "@/stores";

export default function DurationSelect() {
	// initialize available durations as number[]: 90, 60
	const selectedDuration = useSelectedStore((state) => state.selectedDuration);
	const setSelectedDuration = useSelectedStore(
		(state) => state.setSelectedDuration
	);
	const durations = [90, 60];

	return (
		<div>
			{durations.map((duration) => (
				<button
					key={duration}
					className={duration === selectedDuration ? "text-blue-500" : ""}
					onClick={() => setSelectedDuration(duration)}
				>
					{duration} minutes
				</button>
			))}
		</div>
	);
}
