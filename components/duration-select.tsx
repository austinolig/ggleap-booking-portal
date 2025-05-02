"use client";

import { useSelectionStore } from "@/stores";
import { Button } from "./ui/button";

export default function DurationSelect({ durations }: { durations: number[] }) {
	const selectedDuration = useSelectionStore((state) => state.selectedDuration);
	const setSelectedDuration = useSelectionStore(
		(state) => state.setSelectedDuration
	);
	return (
		<div>
			<p>Duration ({selectedDuration})</p>
			<div>
				{durations.map((duration) => (
					<Button
						key={duration}
						onClick={() => setSelectedDuration(duration)}
						variant={
							duration === selectedDuration ? "outlineSelected" : "outline"
						}
					>
						{duration} minutes
					</Button>
				))}
			</div>
		</div>
	);
}
