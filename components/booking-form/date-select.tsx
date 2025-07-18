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
			<p className="font-bold text-muted-foreground flex items-center gap-3">
				<Calendar width={16} />
				<span className="text-foreground">Date</span>
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
			</div>
		</div>
	);
});
