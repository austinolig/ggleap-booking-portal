"use client";

import { useSelectionStore } from "@/stores";

export default function DurationSelect() {
	const selectedDuration = useSelectionStore((state) => state.selectedDuration);
	const setSelectedDuration = useSelectionStore(
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
