import { CreativeStudiosView } from "@/components/curator/create/creative-studios/dashboard";

export default function CuratorCreatePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="bg-card mx-auto w-full max-w-4xl overflow-hidden rounded-4xl shadow">
        <CreativeStudiosView />
      </div>
    </div>
  );
}
