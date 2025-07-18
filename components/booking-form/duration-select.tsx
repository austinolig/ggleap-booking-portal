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
			<p className="font-bold text-muted-foreground flex items-center gap-3">
				<Timer width={16} />
				<span className="text-foreground">Duration</span>
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
