import { addDays, format, set } from "date-fns";

export default function DateSelect() {
  // initialize available booking dates as Date[]: current date, current date + 1
  const currentDate = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const dates = [currentDate, addDays(currentDate, 1)];

  return (
    <div>
      {dates.map((date) => (
        <button>{format(date, "MMM dd, yyyy")}</button>
      ))}
    </div>
  );
}
