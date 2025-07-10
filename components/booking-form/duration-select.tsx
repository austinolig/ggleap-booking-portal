import { memo } from "react";
import { Button } from "../ui/button";
import { Timer } from "lucide-react";

export default memo(function DurationSelect({
	durations,
	selectedDuration,
	setSelectedDuration,
}: {
	durations: number[];
	selectedDuration: number;
	setSelectedDuration: (duration: number) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<p className="font-bold justify-center text-muted-foreground flex items-center gap-2">
				<Timer />
				<span>
					Duration (
					<span className="text-foreground">
						{selectedDuration} minutes
					</span>
					)
				</span>
			</p>
			<div className="grid grid-cols-2 gap-3">
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
});
