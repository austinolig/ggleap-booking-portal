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
	const isDisabled = !selectedDate
		|| !selectedDuration
		|| !selectedMachine
		|| !selectedTime;
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					className="w-full"
					disabled={isDisabled}
				>
					Confirm Booking
				</Button>
			</DrawerTrigger>
			<DrawerContent className="max-w-lg m-auto border-1 px-6 space-y-6">
				<DrawerHeader>
					<DrawerTitle>Confirm Booking</DrawerTitle>
				</DrawerHeader>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<p className="font-bold text-muted-foreground">
							Date
						</p>
						<p>{format(selectedDate, "MMMM d")}</p>
					</div>
					<div>
						<p className="font-bold text-muted-foreground">
							Time
						</p>
						<p>{selectedTime ? format(selectedTime, "h:mm a") : "-:-- --"}</p>
					</div>
					<div>
						<p className="font-bold text-muted-foreground">
							Duration
						</p>
						<p>{selectedDuration} minutes</p>
					</div>
					<div>
						<p className="font-bold text-muted-foreground">
							Machine
						</p>
						<p>{selectedMachine ? selectedMachine.Name : "---"}</p>
					</div>
				</div>
				<div className="space-y-3">
					<h3 className="font-bold text-muted-foreground">
						Terms of Service
					</h3>
					<ScrollArea className="h-30 border rounded-xs">
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
						By confirming, you agree to our terms of service.
					</p>
				</div>
				<DrawerFooter className="flex-grow-1">
					<Button>Confirm</Button>
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
