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
    <div className="space-y-8 px-20 -mt-20">
      <div className="space-y-6">
        <div>
          <div className="relative">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={SIGN_UP_TEXTS.bioStep.officePhonePlaceholder}
              maxLength={10}
              className="w-full p-4 border-4 border-gray-400 rounded-xl text-xl bg-gray-100 focus:border-[#955aa4] focus:outline-none"
            />
            <p className="text-lg font-medium text-gray-400 absolute right-4 top-1/2 -translate-y-1/2">
              {10 - phoneNumber.length}
            </p>
          </div>
          <p className="text-lg text-center font-medium text-gray-500 mt-2">
            {SIGN_UP_TEXTS.bioStep.privateInfo}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-lg ml-4 font-semibold text-gray-700 mb-1 block">
              {SIGN_UP_TEXTS.bioStep.status}
            </Label>
            <span className="text-sm text-gray-500">{140 - bio.length}</span>
          </div>
          <div className="relative">
            <Textarea
              value={bio}
              onChange={handleBioChange}
              placeholder={SIGN_UP_TEXTS.bioStep.bioPlaceholder}
              maxLength={140}
              className="w-full p-4 border-4 border-green-600 rounded-xl text-lg bg-gray-100 focus:border-[#955aa4] focus:outline-none resize-none h-36"
            />
            <p className="text-lg text-center font-medium text-gray-500 mt-2">
              {SIGN_UP_TEXTS.bioStep.bioDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
