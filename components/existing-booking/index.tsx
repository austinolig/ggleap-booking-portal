"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Booking, Machine } from "@/types";
import { Button } from "@/components/ui/button";
import {
  deleteBookingAction,
  extendBookingAction,
  revalidateBookings,
} from "@/lib/actions";
import { format, addMinutes } from "date-fns";
import { useState } from "react";
import { Calendar, Clock, LoaderCircle, PcCase, Timer } from "lucide-react";

interface ConfirmationMessage {
  heading: string;
  body: string;
}

interface ExistingBookingProps {
  booking: Booking;
  machine: Machine;
}

export default function ExistingBooking({
  booking,
  machine,
}: ExistingBookingProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<
    ConfirmationMessage | undefined
  >();

  const bookingStart = new Date(booking.Start);
  const bookingEnd = addMinutes(bookingStart, booking.Duration);
  const currentTime = new Date();
  const isActive =
    currentTime.getTime() >= bookingStart.getTime() &&
    currentTime.getTime() < bookingEnd.getTime();
  const withinExtendWindow =
    currentTime.getTime() >=
      new Date(bookingEnd.getTime() - 15 * 60 * 1000).getTime() &&
    currentTime.getTime() < bookingEnd.getTime();

  const handleDeleteBooking = async () => {
    setIsDeleting(true);
    const result = await deleteBookingAction(booking.BookingUuid);

    setIsDeleting(false);
    if (result) {
      setConfirmationMessage({
        heading: "Booking Deleted",
        body: "Your booking has successfully been deleted.",
      });
    } else {
      setConfirmationMessage({
        heading: "Deletion Failed",
        body: "There was an error deleting your booking. Please try again.",
      });
    }
  };

  const handleExtendBooking = async () => {
    setIsExtending(true);
    const error = await extendBookingAction();
    setIsExtending(false);
    if (error) {
      setConfirmationMessage({
        heading: "Extension Failed",
        body: error,
      });
    } else {
      setConfirmationMessage({
        heading: "Extension Successful",
        body: "Your booking has been extended by 15 minutes.",
      });
    }
  };

  const handleDialog = async (open: boolean) => {
    if (open) {
      await handleExtendBooking();
      setDialogOpen(true);
    } else {
      await revalidateBookings();
      setDialogOpen(false);
    }
  };

  const handleDialog2 = async (open: boolean) => {
    if (open) {
      await handleDeleteBooking();
      setDialogOpen2(true);
    } else {
      await revalidateBookings();
      setDialogOpen2(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="font-bold text-lg">
        Your {isActive ? "active booking" : "upcoming booking"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3">
          <Calendar className="text-muted-foreground" width={16} height={16} />
          <p className="font-bold">{format(bookingStart, "MMMM d")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Timer className="text-muted-foreground" width={16} height={16} />
          <p className="font-bold">{booking.Duration} minutes</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="text-muted-foreground" width={16} height={16} />
          <p className="font-bold">
            {format(bookingStart, "h:mm a")} - {format(bookingEnd, "h:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PcCase className="text-muted-foreground" width={16} height={16} />
          <p className="font-bold">{machine.Name}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Time extensions are available within the last 15 minutes of your
        booking, up to a maximum of 105 minutes total.
      </p>
      <div className="grid gap-3">
        <Dialog open={dialogOpen} onOpenChange={handleDialog}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              // onClick={handleExtendBooking}
              disabled={isExtending || !withinExtendWindow}
              className="w-full"
            >
              {isExtending && <LoaderCircle className="animate-spin" />}
              <span>Extend (+15 mins)</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col gap-6">
              <DialogTitle>{confirmationMessage?.heading}</DialogTitle>
              <DialogDescription>{confirmationMessage?.body}</DialogDescription>
              <DialogClose asChild>
                <Button variant="default">Ok</Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen2} onOpenChange={handleDialog2}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              // onClick={handleDeleteBooking}
              disabled={isDeleting}
            >
              {isDeleting && <LoaderCircle className="animate-spin" />}
              <span>Delete</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col gap-6">
              <DialogTitle>{confirmationMessage?.heading}</DialogTitle>
              <DialogDescription>{confirmationMessage?.body}</DialogDescription>
              <DialogClose asChild>
                <Button variant="default">Ok</Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
