"use client";

import { useState } from "react";
import OptionButton from "./option-button";
import { format } from "date-fns";

export default function DateSelect({ dates }: { dates: Date[] }) {
	const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);

	return (
		<div>
			{dates.map((date) => (
				<OptionButton
					key={date.toISOString()}
					onClick={() => setSelectedDate(date)}
					selected={date === selectedDate}
				>
					{format(date, "MMMM d")}
				</OptionButton>
			))}
		</div>
	);
}
