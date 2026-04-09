import {
  PROVIDER_NOTIFICATION_ACTIONS,
  VALID_PROVIDER_NOTIFICATION_ACTIONS,
  CURATOR_NOTIFICATION_ACTIONS,
  VALID_CURATOR_NOTIFICATION_ACTIONS,
} from "@/lib/constants";
import { DYNAMIC_ROUTES, ROUTES } from "@/lib/constants/routes";
import {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/notification";

export const providerNotificationRouteConfig = {
  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_PATIENT]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_SCHOOL_PATIENTS]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL]:
    DYNAMIC_ROUTES.provider.schoolDetails,
};

export function getProviderNotificationRoute(
  notification: ProviderNotification,
) {
  const { action } = notification;
  if (!action || !VALID_PROVIDER_NOTIFICATION_ACTIONS.includes(action))
    return null;

  const generator = providerNotificationRouteConfig[action];
  return generator(
    notification.action === PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL
      ? notification.targetSchoolId
      : notification.targetId,
  );
}

export const curatorNotificationRouteConfig = {
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL]: (id: string | number) =>
    DYNAMIC_ROUTES.curator.schoolDetails(id),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER]: (id: string | number) =>
    `${ROUTES.curator.providerDetails}/${id}`,
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT]: (
    schoolId: string | number,
    patientId: string | number,
  ) => DYNAMIC_ROUTES.curator.patientDetails(schoolId, patientId),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER]: () => ROUTES.curator.partners,
};

export function getCuratorNotificationRoute(notification: CuratorNotification) {
  const { action, relatedEntityId, schoolId } = notification;
  const validActions = VALID_CURATOR_NOTIFICATION_ACTIONS as string[];
  if (!action || !validActions.includes(action)) return null;

  const validAction = action as keyof typeof curatorNotificationRouteConfig;
  const generator = curatorNotificationRouteConfig[validAction];
  if (action === CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT) {
    return generator(schoolId, relatedEntityId);
  }
  if (action === CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER) {
    return (generator as () => string)();
  }
  return (generator as (id: string | number) => string)(relatedEntityId);
}
