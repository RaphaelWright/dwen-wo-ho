import Navbar from "@/components/provider/new/nav-bar";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/provider/new/urgent-panel";
import NotificationsSheet from "@/components/provider/new/notification-sheet";
import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";

export default function ProviderDashboardPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col w-full">
      <Navbar />
      <div className="grid md:grid-cols-[20%_60%_20%] flex-1 overflow-hidden">
        <SchoolsSidebar />
        <MainContent />
        <UrgentPanel />
      </div>
      <NotificationsSheet />
      <ProfileModal />
      <EditFieldDialog />
    </div>
  );
}
