import { useRouter } from "next/navigation";
import { TIncident } from "./types";

export default function Incident({ incident }: { incident: TIncident }) {
  const router = useRouter();
  return (
    <div
      key={incident.id}
      className={`border border-(--borderColor) rounded-full px-6 ${incident.category.toString() === "Warning" ? "bg-(--warningColorOpaque) border-(--warningColor)" : incident.category.toString() === "Information" ? "bg-(--brandColorOpaque) border-(--brandColor)" : incident.category.toString() === "Urgent" ? "bg-(--dangerColorOpaque) border-(--dangerColor)" : incident.category.toString() === "Positive" ? "bg-(--positiveColorOpaque) border-(--positiveColor)" : ""} cursor-pointer`}
      onClick={() => {
        router.push(`/incident/${incident.id}`);
      }}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-[1.1rem] font-semibold">{incident.title}</h1>
        <h1>Severity: {incident.severity}</h1>
      </div>
      <div>
        <h1>
          {console.log(incident.Child) as any}
          {incident.Child.name.toLocaleLowerCase()} - {incident.Child.grade}
        </h1>
      </div>
    </div>
  );
}
