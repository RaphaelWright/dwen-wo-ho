import { listService } from "./list";
import { schoolsService } from "./schools";
import { activityService } from "./activity";

export const curatorProvidersService = {
  ...listService,
  ...schoolsService,
  ...activityService,
};
