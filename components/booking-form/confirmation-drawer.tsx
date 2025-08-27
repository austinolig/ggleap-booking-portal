"use client";

import { format } from "date-fns";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Machine } from "@/types/index";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { createBookingAction, revalidateBookings } from "@/lib/actions";
import { Calendar, Clock, LoaderCircle, PcCase, Timer } from "lucide-react";

interface ConfirmationMessage {
  heading: string;
  body: string;
}

interface ConfirmationDrawerProps {
  selectedDate: Date;
  selectedDuration: number;
  selectedTime: Date | null;
  selectedMachine: Machine | null;
}

export default function ConfirmationDrawer({
  selectedDate,
  selectedDuration,
  selectedTime,
  selectedMachine,
}: ConfirmationDrawerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<
    ConfirmationMessage | undefined
  >();
  const [isConfirming, setIsConfirming] = useState(false);

  const isDisabled =
    !selectedDate || !selectedDuration || !selectedMachine || !selectedTime;

  const handleConfirm = async () => {
    setIsConfirming(true);
    const error = await createBookingAction(
      selectedTime!,
      selectedDuration,
      selectedMachine!.Uuid,
    );
    setIsConfirming(false);
    if (error) {
      setConfirmationMessage({
        heading: error,
        body: "Please try again or visit our front desk if the issue persists.",
      });
    } else {
      setConfirmationMessage({
        heading: "Booking Confirmed",
        body: "Please check your email confirmation and show our front desk staff upon arrival.",
      });
    }
  };

  const handleDialog = async (open: boolean) => {
    if (open) {
      await handleConfirm();
      setDialogOpen(true);
    } else {
      await revalidateBookings();
      setDialogOpen(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" className="w-full" disabled={isDisabled}>
          Confirm Booking
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-lg m-auto border-1 px-3 space-y-6">
        <DrawerHeader>
          <DrawerTitle>Confirm Booking</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <Calendar
              className="text-muted-foreground"
              width={16}
              height={16}
            />
            <p className="font-bold">{format(selectedDate, "MMMM d")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Timer className="text-muted-foreground" width={16} height={16} />
            <p className="font-bold">{selectedDuration} minutes</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-muted-foreground" width={16} height={16} />
            <p className="font-bold">
              {selectedTime ? format(selectedTime, "h:mm a") : "-:-- --"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PcCase className="text-muted-foreground" width={16} height={16} />
            <p className="font-bold">
              {selectedMachine ? selectedMachine.Name : "---"}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-foreground">Terms of Service</h3>
          <ScrollArea className="h-30 border rounded-xs">
            <p className="p-2 text-sm">
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
          <Dialog open={dialogOpen} onOpenChange={handleDialog}>
            <DialogTrigger asChild>
              <Button variant="default" disabled={isConfirming}>
                {isConfirming && <LoaderCircle className="animate-spin" />}
                <span>Confirm</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="flex flex-col gap-6">
                <DialogTitle>{confirmationMessage?.heading}</DialogTitle>
                <DialogDescription>
                  {confirmationMessage?.body ||
                    "Please wait while we process your booking."}
                </DialogDescription>
                <DialogClose asChild>
                  <Button variant="default">Ok</Button>
                </DialogClose>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
