import { getCenterInfo } from "@/lib/ggLeap";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSelect from "./time-select";
import MachineSelect from "./machine-select";

export default async function BookingForm() {
  const centerInfo = await getCenterInfo();

  if (!centerInfo) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <DateSelect />
      <DurationSelect />
      <TimeSelect centerInfo={centerInfo} />
      <MachineSelect />
    </div>
  );
}
