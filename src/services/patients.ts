import { api } from "@/lib/api";

import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";

import { PatientResult } from "@/lib/types/patient";

import { lockinsService } from "./lockins";

import { LockInAssessment } from "@/lib/types/lockin";

import { Provider } from "@/lib/types/provider";

import { PatientActionResponseDTO } from "@/lib/types/api/patient-results";

import { LockinUpdateResponse } from "@/lib/types/api/lockin";

export const patientsService = {
  getPatientResult: async (
    resultId: string | number,
  ): Promise<PatientResult> => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET(resultId));

    if (response?.success && response.data) {
      return response.data as PatientResult;
    }

    throw new Error("Failed to fetch patient result");
  },

  getSchoolResults: async (
    schoolId: string | number,
  ): Promise<PatientResult[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_SCHOOL_RESULTS(schoolId),
    );

    if (response?.success && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }

    return [];
  },

  openPatientResult: async (
    resultId: string | number,
  ): Promise<PatientResult> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.OPEN(resultId),

      {
        method: "POST",
      },
    );

    if (response?.success && response.data) {
      return response.data as PatientResult;
    }

    throw new Error("Failed to open patient result");
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

    if (response?.success && response.data) {
      return response.data as PatientResult;
    }

    throw new Error("Failed to update action status");
  },

  getPatientActions: async (
    resultId: string | number,
  ): Promise<PatientActionResponseDTO[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.ACTIONS(resultId),
    );

    if (response?.success && response.data)
      return Array.isArray(response.data) ? response.data : [];

    return [];
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

    if (response?.success && response.data)
      return response.data as PatientActionResponseDTO;

    throw new Error("Failed to add patient action");
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

    if (response?.success && response.data)
      return response.data as PatientResult;

    throw new Error("Failed to set referred provider");
  },

  getAvailableProvidersForReferral: async (
    resultId: string | number,
  ): Promise<Provider[]> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.AVAILABLE_PROVIDERS_FOR_REFERRAL(
        resultId,
      ),
    );

    if (response?.success && response.data)
      return Array.isArray(response.data) ? response.data : [];

    return [];
  },

  createPatientResult: async (data: {
    lockinId: number;

    schoolId: number;
  }): Promise<PatientResult> => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_RESULTS.CREATE, {
      method: "POST",

      body: JSON.stringify(data),
    });

    if (response?.success && response.data) {
      return response.data as PatientResult;
    }

    throw new Error("Failed to create patient result");
  },

  getFullPatientDetails: async (
    resultId: string | number,
  ): Promise<{
    patientResult: PatientResult;

    lockInAssessment: LockInAssessment | null;
  }> => {
    const patientResult = await patientsService.getPatientResult(resultId);

    let lockInAssessment: LockInAssessment | null = null;

    if (patientResult.lockinId) {
      try {
        const lockInUpdateData = await lockinsService.getLockInUpdate(
          patientResult.lockinId,
        );

        if (lockInUpdateData) {
          const data = lockInUpdateData as LockinUpdateResponse;

          // Extract colors from assessmentItems array

          const items =
            (data.assessmentItems as Array<{
              itemName: string;

              color: string;
            }>) ?? [];

          const colorMap: Record<string, string> = {};

          for (const item of items) {
            colorMap[item.itemName] = item.color;
          }

          lockInAssessment = {
            lockinId: data.lockinId,

            fullName: patientResult.patientName,

            age: patientResult.patientAge,

            sex: patientResult.patientSex,

            school: patientResult.schoolName,

            schoolType: data.schoolType,

            comment: data.comment,

            lockinDate: data.lockinDate,

            lockedInScore:
              typeof data.lockedInScore === "number"
                ? data.lockedInScore.toFixed(2)
                : String(data.lockedInScore ?? "N/A"),

            lockedInScoreDescription: String(
              data.lockedInScoreDescription ?? "N/A",
            ),

            lockedInColor: String(data.lockedInColor ?? "gray"),

            generalMentalHealth: String(
              data.generalMentalHealthDescription ?? "N/A",
            ),

            generalMentalHealthScore: String(
              data.generalMentalHealthScore ?? "N/A",
            ),

            generalMentalHealthColor:
              colorMap["Overall Mental Health"] ?? "gray",

            possibleDepressionScore: String(data.depressionScore ?? "N/A"),

            possibleDepressionDescription: String(
              data.depressionDescription ?? "N/A",
            ),

            possibleDepressionColor: colorMap["Possible Depression"] ?? "gray",

            lonelinessScore: String(data.lonelinessScore ?? "N/A"),

            lonelinessScoreDescription: String(
              data.lonelinessDescription ?? "N/A",
            ),

            lonelinessColor: colorMap["Loneliness"] ?? "gray",

            suicidalRiskScore: String(data.suicidalityScore ?? "N/A"),

            suicidalRiskScoreDescription: String(
              data.suicidalityDescription ?? "N/A",
            ),

            suicidalRiskColor: colorMap["Suicidal Risk"] ?? "gray",

            examAnxiety: String(data.examAnxietyDescription ?? "N/A"),

            examAnxietyScore: String(data.examAnxietyScore ?? "N/A"),

            examAnxietyColor: colorMap["Overall Exam Anxiety"] ?? "gray",

            coreAnxietyScore: String(data.coreAnxietyScore ?? "N/A"),

            coreAnxietyScoreDescription: String(
              data.coreAnxietyDescription ?? "N/A",
            ),

            coreAnxietyColor: colorMap["Core Anxiety"] ?? "gray",

            physicalDistressScore: String(data.physicalDistressScore ?? "N/A"),

            physicalDistressScoreDescription: String(
              data.physicalDistressDescription ?? "N/A",
            ),

            physicalDistressColor: colorMap["Physical Distress"] ?? "gray",

            examPrep: String(data.examPreparationDescription ?? "N/A"),

            examPrepScore: String(data.examPreparationScore ?? "N/A"),

            examPrepColor: colorMap["Overall Exam Preparation"] ?? "gray",

            motivationScore: String(data.motivationScore ?? "N/A"),

            motivationScoreDescription: String(
              data.motivationDescription ?? "N/A",
            ),

            motivationColor: colorMap["Motivation"] ?? "gray",

            studySkillsScore: String(data.studySkillsScore ?? "N/A"),

            studySkillsScoreDescription: String(
              data.studySkillsDescription ?? "N/A",
            ),

            studySkillsColor: colorMap["Study Skills"] ?? "gray",

            procrastinationScore: String(data.procrastinationScore ?? "N/A"),

            procrastinationScoreDescription: String(
              data.procrastinationDescription ?? "N/A",
            ),

            procrastinationColor: colorMap["Procrastination"] ?? "gray",

            inUrgentCare: data.inUrgentCare,

            urgentCareEnteredAt: data.urgentCareEnteredAt,

            timeInUrgentCareMinutes: data.timeInUrgentCareMinutes,

            schoolTypeAverages: data.schoolTypeAverages,

            assessmentItems: data.assessmentItems,
          };
        }
      } catch (error) {
        console.error("Error fetching lock-in update data:", error);
      }
    }

    return { patientResult, lockInAssessment };
  },

  // T3-11: Increment visit count when patient selects a school

  incrementVisit: async (schoolId: string | number): Promise<void> => {
    await api(
      `${STATIC_ENDPOINTS.PATIENT_RESULTS.CREATE}/school/${schoolId}/visit`,

      {
        method: "POST",
      },
    );
  },

  deleteSinglePatientRecord: async (
    resultId: string | number,
  ): Promise<void> => {
    await api(
      `${DYNAMIC_ENDPOINTS.PATIENT_RESULTS.DELETE_SINGLE_PATIENT_RECORD(resultId)}`,
      {
        method: "DELETE",
      },
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
