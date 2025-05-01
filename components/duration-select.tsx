"use client";

import { useState } from "react";
import OptionButton from "./option-button";

export default function DurationSelect({ durations }: { durations: number[] }) {
	const [selectedDuration, setSelectedDuration] = useState<number>(
		durations[0]
	);

	return (
		<div>
			{durations.map((duration) => (
				<OptionButton
					key={duration}
					onClick={() => setSelectedDuration(duration)}
					selected={duration === selectedDuration}
				>
					{duration} minutes
				</OptionButton>
			))}
		</div>
	);
}
