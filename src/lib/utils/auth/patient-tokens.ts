import { setUserType } from "@/lib/utils/auth/get-user-type";

export function applyPatientAuthTokens({
  accessToken,
  refreshToken,
}: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  if (accessToken) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("patientToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  localStorage.removeItem("curatorToken");
  setUserType("patient");
}
