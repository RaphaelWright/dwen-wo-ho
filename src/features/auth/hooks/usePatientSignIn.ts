import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { ROUTES } from "@/constants/routes";

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

interface UsePatientSignInProps {
  email: string | null;
}

export const usePatientSignIn = ({ email }: UsePatientSignInProps) => {
  const router = useRouter();
  const { loginMutation } = useAuthQuery();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setErrorMessage("");
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/signin"); // Original redirection. Should maybe be ROUTES.patient.home?
        // Note: The original code redirected to "/signin". I'll keep it for now but it looks suspicious.
        // Actually, looking at patient flow, maybe they go to dashboard?
        // I'll stick to original behavior.
      },
      onError: (error: any) => {
        // Add error handling if needed, though original code implies it might handle it inside mutation wrapper or just not show error
        setErrorMessage(error?.message || "Sign in failed");
      },
    });
  };

  // Effect to redirect if no email (handled in component originally, but can be here or in component)
  useEffect(() => {
    if (!email) {
      router.push(ROUTES.patient.checkEmail);
    }
  }, [email, router]);

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: loginMutation.isPending,
    errorMessage,
  };
};
