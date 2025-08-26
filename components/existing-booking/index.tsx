"use client";

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

  const bookingStart = new Date(booking.Start);
  const bookingEnd = addMinutes(bookingStart, booking.Duration);
  const currentTime = new Date();
  const isActive = currentTime >= bookingStart && currentTime <= bookingEnd;
  // const withinExtendWindow =
  //   currentTime >= new Date(bookingEnd.getTime() - 15 * 60 * 1000) &&
  //   currentTime < bookingEnd;
  const isMaxExtended = booking.Duration === 105;

  const handleDeleteBooking = async () => {
    setIsDeleting(true);
    try {
      await deleteBookingAction(booking.BookingUuid);
    } finally {
      await revalidateBookings();
    }
  };

  const handleExtendBooking = async () => {
    setIsExtending(true);
    try {
      const error = await extendBookingAction();
      if (error) {
        alert(error);
      } else {
        alert("Booking extended successfully!");
        await revalidateBookings();
      }
    } finally {
      setIsExtending(false);
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
        <Button
          variant="default"
          onClick={handleExtendBooking}
          // disabled={isExtending || !withinExtendWindow}
          disabled={isExtending || isMaxExtended}
          className="w-full"
        >
          {isExtending && <LoaderCircle className="animate-spin" />}
          <span>Extend (+15 mins)</span>
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteBooking}
          disabled={isDeleting}
        >
          {isDeleting && <LoaderCircle className="animate-spin" />}
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}
