"use client";

import { format, isEqual } from "date-fns";
import { Button } from "./ui/button";
import { useContext } from "react";
import { DateContext } from "./booking-form";
import { useStore } from "zustand";

export default function DateSelect({ dates }: { dates: Date[] }) {
	const dateStore = useContext(DateContext);
	if (!dateStore) throw new Error("Missing DateContext.Provider in the tree");
	const selectedDate = useStore(dateStore, (state) => state.selectedDate);
	const setSelectedDate = useStore(dateStore, (state) => state.setSelectedDate);

	return (
		<div>
			<p>Date ({format(selectedDate, "MMMM d")})</p>
			<div>
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
}
