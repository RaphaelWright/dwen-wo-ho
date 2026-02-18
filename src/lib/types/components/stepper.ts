export type ValueOf<T extends string[]> = T[number];

export interface IStepperProps<T extends string[]> {
  steps: T;
  step: ValueOf<T>;
}
