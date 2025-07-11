import { format, isEqual } from "date-fns";
import { Button } from "../ui/button";
import { memo } from "react";
import { Calendar } from "lucide-react";

export default memo(function DateSelect({
	dates,
	selectedDate,
	setSelectedDate,
}: {
	dates: Date[];
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<p className="font-bold text-muted-foreground flex items-center gap-2">
				<Calendar />
				<span>Date</span>
			</p>
			<div className="grid grid-cols-2 gap-3">
				{dates.map((date) => (
					<Button
						key={date.toISOString()}
						onClick={() => setSelectedDate(date)}
						variant={
							isEqual(date, selectedDate) ? "outlineSelected" : "outline"
						}
					>
						{format(date, "MMMM d")}
					</Button>
				))}
				<div className="relative w-full h-9 rounded-md overflow-hidden bg-esports-gradient">
					<div className="absolute inset-[1px] rounded-md bg-background/90" />
				</div>
			</div>
		</div>
	);
});
