import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";

const useAuthQuery = () => {
  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: authService.login,
  });

  const signupMutation = useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: authService.signup,
  });

  const verifyEmailMutation = useMutation({
    mutationKey: ["auth", "verifyEmail"],
    mutationFn: authService.verifyEmail,
  });

  const checkEmailMutation = useMutation({
    mutationKey: ["auth", "checkEmail"],
    mutationFn: authService.checkEmail,
  });

  const sendVerificationEmailMutation = useMutation({
    mutationKey: ["auth", "sendVerificationEmail"],
    mutationFn: authService.sendVerificationEmail,
  });

  const recoverAccountMutation = useMutation({
    mutationKey: ["auth", "recoverAccount"],
    mutationFn: authService.recoverAccount,
  });

  const submitRecoveryCodeMutation = useMutation({
    mutationKey: ["auth", "submitRecoveryCode"],
    mutationFn: authService.submitAccountRecoveryCode,
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["auth", "resetPassword"],
    mutationFn: authService.resetPassword,
  });

  const addPhotoMutation = useMutation({
    mutationKey: ["auth", "addPhoto"],
    mutationFn: authService.addPhoto,
  });

  const updateProfileMutation = useMutation({
    mutationKey: ["auth", "updateProfile"],
    mutationFn: authService.updateProfile,
  });

  const addSpecialtyMutation = useMutation({
    mutationKey: ["auth", "addSpecialty"],
    mutationFn: authService.addSpecialty,
  });



  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    checkEmailMutation,
    sendVerificationEmailMutation,
    recoverAccountMutation,
    submitRecoveryCodeMutation,
    resetPasswordMutation,
    addPhotoMutation,
    updateProfileMutation,
    addSpecialtyMutation,
  };
};

export default useAuthQuery;
