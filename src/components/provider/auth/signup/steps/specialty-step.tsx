"use client";

import { SpecialtyStepProps } from "@/lib/types/provider/auth";
import {
  SIGN_UP_TEXTS,
  PROVIDER_SPECIALTIES,
} from "@/lib/constants/components/provider/auth/signup";
import { Button } from "@/components/ui/button";
import { useSpecialtyStep } from "@/hooks/components/provider/auth/signup/use-specialty-step";

const SpecialtyStep = (props: SpecialtyStepProps) => {
  const { selectedSpecialty, handleSpecialtySelect } = useSpecialtyStep(props);

  return (
    <div className="space-y-8 px-11">
      <h1 className="text-5xl font-extrabold text-center ">
        {SIGN_UP_TEXTS.specialtyStep.title}
      </h1>
      <p className="text-xl font-medium text-gray-500 text-center -mt-5">
        {SIGN_UP_TEXTS.specialtyStep.subtitle}
      </p>

      <div className="grid grid-cols-2 gap-3.5 max-w-2xl mx-auto">
        {PROVIDER_SPECIALTIES.map((specialty) => (
          <Button
            key={specialty}
            onClick={() => handleSpecialtySelect(specialty)}
            className={`p-4 rounded-full text-center font-bold text-lg transition-all duration-200 ${
              selectedSpecialty === specialty
                ? "bg-gray-500 text-white shadow-md active:scale-95"
                : "bg-gray-400 text-gray-300 hover:bg-gray-400/90 active:scale-95"
            }`}
          >
            {specialty}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyStep;
