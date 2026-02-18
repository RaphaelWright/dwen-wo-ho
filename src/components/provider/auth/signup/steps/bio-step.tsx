import { BioStepProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBioStep } from "@/hooks/components/provider/auth/signup/use-bio-step";

const BioStep = (props: BioStepProps) => {
  const { phoneNumber, bio } = props;
  const { handlePhoneChange, handleBioChange } = useBioStep(props);

  return (
    <div className="space-y-8 px-4 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={SIGN_UP_TEXTS.bioStep.officePhonePlaceholder}
              maxLength={10}
              className="h-14 pl-4 pr-16 text-lg border-input bg-background focus-visible:ring-primary transition-all duration-200 shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {10 - phoneNumber.length} left
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {SIGN_UP_TEXTS.bioStep.privateInfo}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-lg font-semibold">
              {SIGN_UP_TEXTS.bioStep.status}
            </Label>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                140 - bio.length < 10
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {140 - bio.length} characters left
            </span>
          </div>
          <div className="relative">
            <Textarea
              value={bio}
              onChange={handleBioChange}
              placeholder={SIGN_UP_TEXTS.bioStep.bioPlaceholder}
              maxLength={140}
              className="min-h-40 p-4 text-lg border-input bg-background focus-visible:ring-primary resize-none shadow-sm transition-all duration-200"
            />
            <p className="text-sm text-muted-foreground text-center mt-2">
              {SIGN_UP_TEXTS.bioStep.bioDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
