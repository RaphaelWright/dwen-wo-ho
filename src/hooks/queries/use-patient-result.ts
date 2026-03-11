import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { patientsService } from "@/services/patients";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export default function usePatientResultQuery() {
  const queryClient = useQueryClient();

  const usePatientFullDetails = (
    patientId: string,
    options?: { enabled?: boolean },
  ) =>
    useQuery({
      queryKey: [QUERY_KEYS.patientResult, "full-details", patientId],
      queryFn: () => patientsService.getFullPatientDetails(patientId),
      enabled: (options?.enabled ?? true) && !!patientId,
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const createPatientResultMutation = useMutation({
    mutationFn: patientsService.createPatientResult,
    onSuccess: (_, { schoolId }) => {
      // Invalidate school students and patient results list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schools, "students", String(schoolId)],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.patientResult] });
      toast.success("Patient result created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create patient result");
    },
  });

  const updateActionStatusMutation = useMutation({
    mutationFn: ({
      resultId,
      data,
    }: {
      resultId: string | number;
      data: { providerId: string | number; actionStatus: string };
    }) => patientsService.updateActionStatus(resultId, data),
    onSuccess: (_, { resultId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.patientResult, "full-details", String(resultId)],
      });
      toast.success("Action status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update action status");
    },
  });

  return {
    usePatientFullDetails,
    createPatientResult: createPatientResultMutation.mutateAsync,
    isCreating: createPatientResultMutation.isPending,
    updateActionStatus: updateActionStatusMutation.mutateAsync,
    isUpdating: updateActionStatusMutation.isPending,
  };
}
