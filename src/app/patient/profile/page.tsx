import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata(
  "Profile",
  "Manage your Dwen Wo Ho patient profile.",
  "/patient/profile",
);

const Profile = () => {
  return <div>Profile</div>;
};

export default Profile;
