import { format } from "date-fns";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { Machine } from "@/types/index"
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { confirmBooking } from "@/lib/actions";
import { Calendar, Clock, PcCase, Timer } from "lucide-react";

export default function ConfirmationDrawer({
	selectedDate,
	selectedDuration,
	selectedTime,
	selectedMachine,
}: {
	selectedDate: Date;
	selectedDuration: number;
	selectedTime: Date | null;
	selectedMachine: Machine | null;
}) {
	const [scrolledToBottom, setScrolledToBottom] = useState(false);

	const isDisabled = !selectedDate
		|| !selectedDuration
		|| !selectedMachine || !selectedTime;

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const distanceFromBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop;
		const atBottom = distanceFromBottom === e.currentTarget.clientHeight;
		if (!scrolledToBottom) {
			setScrolledToBottom(atBottom);
		}
	}

	const handleBooking = async () => {
		const error = await confirmBooking(selectedTime!, selectedDuration, selectedMachine!.Uuid);
		if (error) {
			alert(error);
		} else {
			alert("Booking confirmed!");
		}
	}

	return (
		<Drawer onOpenChange={() => setScrolledToBottom(false)}>
			<DrawerTrigger asChild>
				<Button
					variant="default"
					className="w-full"
					disabled={isDisabled}
				>
					Confirm Booking
				</Button>
			</DrawerTrigger>
			<DrawerContent className="max-w-lg m-auto border-1 px-6 space-y-8">
				<DrawerHeader>
					<DrawerTitle>Confirm Booking</DrawerTitle>
				</DrawerHeader>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-2">
						<Calendar className="text-muted-foreground" width={16} height={16} />
						<p className="font-bold">
							{format(selectedDate, "MMMM d")}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="text-muted-foreground" width={16} height={16} />
						<p className="font-bold">
							{selectedTime ? format(selectedTime, "h:mm a") : "-:-- --"}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Timer className="text-muted-foreground" width={16} height={16} />
						<p className="font-bold">
							{selectedDuration} minutes
						</p>
					</div>
					<div className="flex items-center gap-2">
						<PcCase className="text-muted-foreground" width={16} height={16} />
						<p className="font-bold">
							{selectedMachine ? selectedMachine.Name : "---"}
						</p>
					</div>
				</div>
				<div className="space-y-3">
					<h3 className="font-bold text-muted-foreground">
						Terms of Service
					</h3>
					<ScrollArea
						className="h-30 border rounded-xs"
						onScroll={handleScroll}
					>
						<p className="p-2">
							{`
								Lorem ipsum dolor sit amet, consectetur adipiscing
								elit, sed do eiusmod tempor incididunt ut labore
								et dolore magna aliqua. Ut enim ad minim veniam,
								quis nostrud exercitation ullamco laboris nisi ut
								aliquip ex ea commodo consequat. Duis aute irure
								dolor in reprehenderit in voluptate velit esse
								cillum dolore eu fugiat nulla pariatur. Excepteur
								sint occaecat cupidatat non proident, sunt in culpa
								qui officia deserunt mollit anim id est laborum.
							`}
						</p>
					</ScrollArea>
					<p className="text-sm text-muted-foreground">
						{`
							To complete your booking, please review the terms
							of service. By confirming, you agree to these terms.
						`}
					</p>
				</div>
				<DrawerFooter className="flex-grow-1">
					<Button
						disabled={!scrolledToBottom}
						onClick={handleBooking}
						variant="default"
					>
						Confirm
					</Button>
					<DrawerClose asChild>
						<Button
							className="w-full"
							variant="outline"
						>
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>

	)
}
