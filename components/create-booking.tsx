"use client";

export default function CreateBooking() {
  const handleClick = async () => {
    try {
      const response = await fetch("/api/bookings/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-1 grid grid-cols-[auto_1fr] gap-4">
      <p className="font-bold">Create Booking</p>
      <button
        onClick={handleClick}
        className="border-1 p-4 cursor-pointer w-full"
      >
        Create booking
      </button>
    </div>
  );
}
