import { NewPasswordFormProps } from "@/lib/types/components/patient/new-password";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewPasswordForm({
  register,
  errors,
  showPassword,
  onTogglePassword,
  onSubmit,
}: NewPasswordFormProps) {
  return (
    <form id="login-form" onSubmit={onSubmit} className="px-12">
      <h1 className="text-6xl text-center font-extrabold">
        {NEW_PASSWORD_TEXTS.form.title}
      </h1>
      <div className="my-16 space-y-5">
        <div className="relative mt-4 flex flex-col">
          <Input
            {...register("password")}
            placeholder={NEW_PASSWORD_TEXTS.form.passwordPlaceholder}
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors?.password?.message
                ? "border-destructive"
                : "border-success"
            } text-2xl text-foreground p-4 bg-muted/50`}
          />
          <Button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
          >
            {!showPassword ? (
              <span>{NEW_PASSWORD_TEXTS.form.show}</span>
            ) : (
              <span>{NEW_PASSWORD_TEXTS.form.hide}</span>
            )}
          </Button>
        </div>
        <div className="relative mt-4 flex flex-col">
          <Input
            {...register("repeatPassword")}
            placeholder={NEW_PASSWORD_TEXTS.form.repeatPasswordPlaceholder}
            type={showPassword ? "text" : "password"}
            className={`font-bold w-full rounded-xl border-4 ${
              errors?.repeatPassword?.message
                ? "border-destructive"
                : "border-success"
            } text-2xl text-foreground p-4 bg-muted/50`}
          />
          <Button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-0.5 transform -translate-x-1/2 -translate-y-1/2"
          >
            {!showPassword ? (
              <span>{NEW_PASSWORD_TEXTS.form.show}</span>
            ) : (
              <span>{NEW_PASSWORD_TEXTS.form.hide}</span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
