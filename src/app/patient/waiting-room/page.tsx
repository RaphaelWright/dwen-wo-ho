import { getMetadata } from "@/lib/metadata";
import PatientWaitingRoomView from "./view";

export const metadata = getMetadata(
  "Waiting Room",
  "You're in the Dwen Wo Ho waiting room — a provider will be with you shortly.",
  "/patient/waiting-room",
);

export default function PatientWaitingRoomPage() {
  return <PatientWaitingRoomView />;
}
