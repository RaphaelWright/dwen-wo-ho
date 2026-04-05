"use client";

import { SpecialtyStepProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { Button } from "@/components/ui/button";

import { useSpecialtyStep } from "@/hooks/components/provider/auth/signup/use-specialty-step";

const SpecialtyStep = (props: SpecialtyStepProps) => {
  const {
    selectedSpecialty,
    handleSpecialtySelect,
    specialties,
    isLoadingSpecialties,
  } = useSpecialtyStep(props);

  return (
    <div className="space-y-8 px-4 md:px-11 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {SIGN_UP_TEXTS.specialtyStep.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {SIGN_UP_TEXTS.specialtyStep.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {isLoadingSpecialties
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 w-full bg-muted rounded-xl animate-pulse" />
            ))
          : specialties.map((specialty) => (
              <Button
                key={specialty}
                onClick={() => handleSpecialtySelect(specialty)}
                variant={
                  selectedSpecialty === specialty ? "default" : "outline"
                }
                className={`h-auto py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
                  selectedSpecialty === specialty
                    ? "shadow-md scale-[1.02] ring-2 ring-primary ring-offset-2"
                    : "hover:bg-muted/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
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
