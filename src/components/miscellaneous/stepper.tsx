import { IStepperProps } from "@/lib/types/components/stepper";
import { useStepper } from "@/hooks/components/miscellaneous/use-stepper";

const Stepper = <T extends string[]>({ steps, step }: IStepperProps<T>) => {
  const { isStatusActive, isStatusCompleted } = useStepper(steps, step);

  return (
    <ul role="list" className="flex space-x-4">
      {steps.map((item, itemIdx) => {
        const currentStatusIndex = steps.findIndex(
          (currStatus) => currStatus.toLowerCase() === item.toLowerCase(),
        );
        return (
          <li key={itemIdx}>
            <div className="flex items-center space-x-2">
              <div>
                {isStatusActive(currentStatusIndex) ? (
                  <div className="w-4 h-4 border grid place-items-center border-black rounded-full">
                    <div className="bg-black w-2 h-2 rounded-full"></div>
                  </div>
                ) : isStatusCompleted(currentStatusIndex) ? (
                  <div className="w-4 h-4 border grid place-items-center border-gray-400 rounded-full">
                    <div className="bg-gray-400 w-2 h-2 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 border grid place-items-center border-black rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className={`${
                    isStatusActive(currentStatusIndex)
                      ? "text-black"
                      : "text-gray-500"
                  } text-sm font-bold whitespace-nowrap`}
                >{`${itemIdx + 1}. ${item}`}</p>
                {itemIdx !== steps.length - 1 ? <hr className="w-7.5" /> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Stepper;
