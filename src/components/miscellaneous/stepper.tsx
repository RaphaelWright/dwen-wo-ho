import { IStepperProps } from "@/lib/types/components/stepper";
import { useStepper } from "@/hooks/components/miscellaneous/use-stepper";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Stepper = <T extends string[]>({ steps, step }: IStepperProps<T>) => {
  const { isStatusActive, isStatusCompleted } = useStepper(steps, step);

  return (
    <div className="w-full overflow-x-auto py-2">
      <ul role="list" className="flex items-center min-w-max space-x-2">
        {steps.map((item, itemIdx) => {
          const currentStatusIndex = steps.findIndex(
            (currStatus) => currStatus.toLowerCase() === item.toLowerCase(),
          );
          const isActive = isStatusActive(currentStatusIndex);
          const isCompleted = isStatusCompleted(currentStatusIndex);
          const isLast = itemIdx === steps.length - 1;

          return (
            <li key={itemIdx} className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/50",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 animate-in zoom-in" />
                    ) : (
                      <span className="text-xs font-bold">{itemIdx + 1}</span>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-sm font-medium whitespace-nowrap transition-colors duration-300",
                      isActive
                        ? "text-foreground font-bold"
                        : isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50",
                    )}
                  >
                    {item}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 w-8 rounded-full transition-colors duration-500",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20",
                    )}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stepper;
