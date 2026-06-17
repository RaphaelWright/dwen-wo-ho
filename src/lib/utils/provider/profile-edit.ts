import type {
  PersistProviderProfileEditParams,
  ProviderProfileTextField,
} from "@/lib/types/components/provider/profile-edit";

const PROFILE_TEXT_FIELDS = ["title", "name", "specialty", "status"] as const;

function isProviderProfileTextField(
  key: string,
): key is ProviderProfileTextField {
  return (PROFILE_TEXT_FIELDS as readonly string[]).includes(key);
}

export async function persistProviderProfileEdit({
  editFieldKey,
  editValue,
  profileStatus,
  updateProfile,
  updatePhoneNumber,
}: PersistProviderProfileEditParams): Promise<string | null> {
  if (!editFieldKey || editFieldKey === "photo" || !editValue.trim()) {
    return null;
  }

  const trimmed = editValue.trim();

  if (editFieldKey === "phone") {
    await updatePhoneNumber({
      officePhoneNumber: trimmed,
      currentStatus: profileStatus,
    });
    return trimmed;
  }

  if (isProviderProfileTextField(editFieldKey)) {
    await updateProfile({ fieldKey: editFieldKey, value: trimmed });
    return trimmed;
  }

  return null;
}
