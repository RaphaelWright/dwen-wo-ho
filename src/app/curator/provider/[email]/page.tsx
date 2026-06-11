import { getMetadata } from "@/lib/metadata";
import CuratorProviderDetailsView from "./view";

export const metadata = getMetadata(
  "Provider Details",
  "Review provider details and application status on Dwen Wo Ho.",
  "/curator/provider",
);

export default function CuratorProviderDetailsPage() {
  return <CuratorProviderDetailsView />;
}
