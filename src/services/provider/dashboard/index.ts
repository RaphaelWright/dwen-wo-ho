import { profileService } from "./profile";
import { patientsService } from "./patients";
import { notificationsService } from "./notifications";
import { schoolsService } from "./schools";

export const providerDashboardService = {
  ...profileService,
  ...patientsService,
  ...notificationsService,
  ...schoolsService,
};
