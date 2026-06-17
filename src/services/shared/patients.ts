import { api } from "@/lib/api";

import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";

import { PatientResult } from "@/lib/types/entities/patient";
import { LockInAssessment } from "@/lib/types/entities/lockin";
import { Provider } from "@/lib/types/entities/provider";
import { LockinUpdateResponse } from "@/lib/types/api/lockin";

import { PatientActionResponseDTO } from "@/lib/types/api/patient-results";
import {
  extractArrayData,
  requireSuccessData,
} from "@/lib/utils/shared/api-result";
import {
  buildAssessmentColorMap,
  mapLockInUpdateToAssessment,
} from "@/lib/utils/patient/map-lockin-to-assessment";
import { lockinsService } from "../patient/lock-ins";

function mapLockInResponseToAssessment(
  data: LockinUpdateResponse,
  patientResult: PatientResult,
): LockInAssessment {
  const items =
    (data.assessmentItems as Array<{ itemName: string; color: string }>) ?? [];
  const colorMap = buildAssessmentColorMap(items);
  return mapLockInUpdateToAssessment(data, patientResult, colorMap);
}

async function fetchLockInAssessmentForPatient(
  patientResult: PatientResult,
): Promise<LockInAssessment | null> {
  if (!patientResult.lockinId) return null;

  try {
    const lockInUpdateData = await lockinsService.getLockInUpdate(
      patientResult.lockinId,
    );
    if (!lockInUpdateData) return null;
    return mapLockInResponseToAssessment(
      lockInUpdateData as LockinUpdateResponse,
      patientResult,
    );
  } catch (error) {
    console.error("Error fetching lock-in update data:", error);
    return null;
  }
}

export const patientsService = {
  getPatientResult: async (
    resultId: string | number,
  ): Promise<PatientResult> => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET(resultId));
    return requireSuccessData<PatientResult>(
      response,
      "Failed to fetch patient result",
    );
  },

  getSchoolResults: async (
    schoolId: string | number,
  ): Promise<PatientResult[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_SCHOOL_RESULTS(schoolId),
    );
    return extractArrayData<PatientResult>(response);
  },

  openPatientResult: async (
    resultId: string | number,
  ): Promise<PatientResult> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.OPEN(resultId),
      { method: "POST" },
    );
    return requireSuccessData<PatientResult>(
      response,
      "Failed to open patient result",
    );
  },

  updateActionStatus: async (
    resultId: string | number,
    data: { providerId: string | number; actionStatus: string },
  ): Promise<PatientResult> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.UPDATE_ACTION_STATUS(resultId),
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return requireSuccessData<PatientResult>(
      response,
      "Failed to update action status",
    );
  },

  getPatientActions: async (
    resultId: string | number,
  ): Promise<PatientActionResponseDTO[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.ACTIONS(resultId),
    );
    return extractArrayData<PatientActionResponseDTO>(response);
  },

  addPatientAction: async (
    resultId: string | number,
    data: { title: string; type: string; notes?: string },
  ): Promise<PatientActionResponseDTO> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.ACTIONS(resultId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return requireSuccessData<PatientActionResponseDTO>(
      response,
      "Failed to add patient action",
    );
  },

  setReferredProvider: async (
    resultId: string | number,
    referredProviderId: string,
  ): Promise<PatientResult> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.SET_REFERRED_PROVIDER(resultId),
      {
        method: "PUT",
        body: JSON.stringify({ referredProviderId }),
      },
    );
    return requireSuccessData<PatientResult>(
      response,
      "Failed to set referred provider",
    );
  },

  getAvailableProvidersForReferral: async (
    resultId: string | number,
  ): Promise<Provider[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.AVAILABLE_PROVIDERS_FOR_REFERRAL(
        resultId,
      ),
    );
    return extractArrayData<Provider>(response);
  },

  createPatientResult: async (data: {
    lockinId: number;
    schoolId: number;
  }): Promise<PatientResult> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_RESULTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return requireSuccessData<PatientResult>(
      response,
      "Failed to create patient result",
    );
  },

  getFullPatientDetails: async (
    resultId: string | number,
  ): Promise<{
    patientResult: PatientResult;
    lockInAssessment: LockInAssessment | null;
  }> => {
    const patientResult = await patientsService.getPatientResult(resultId);
    const lockInAssessment =
      await fetchLockInAssessmentForPatient(patientResult);
    return { patientResult, lockInAssessment };
  },

  incrementVisit: async (schoolId: string | number): Promise<void> => {
    await api(
      `${STATIC_ENDPOINTS.PATIENT_RESULTS.CREATE}/school/${schoolId}/visit`,
      { method: "POST" },
    );
  },

  deleteSinglePatientRecord: async (
    resultId: string | number,
  ): Promise<void> => {
    await api(
      `${DYNAMIC_ENDPOINTS.PATIENT_RESULTS.DELETE_SINGLE_PATIENT_RECORD(resultId)}`,
      { method: "DELETE" },
    );
  },

  deleteAllPatientRecords: async (patientIds: number[]): Promise<void> => {
    await api(
      `${STATIC_ENDPOINTS.PATIENT_RESULTS.BULK_DELETE_PATIENT_RECORDS}`,
      {
        method: "DELETE",
        body: JSON.stringify({ resultIds: patientIds }),
      },
    );
  },
};
