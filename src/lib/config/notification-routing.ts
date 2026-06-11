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

const providerNotificationRouteConfig = {
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
  let computedAction = notification.action as string;

  const validActions = VALID_PROVIDER_NOTIFICATION_ACTIONS as string[];

  // Compute action based on the notification data if the backend action is not a valid enum
  if (!computedAction || !validActions.includes(computedAction)) {
    if (
      notification.category === "NEW_PATIENT_ADDED" ||
      notification.category === "STAR_PROVIDER_ASSIGNED" ||
      notification.targetType === "PATIENT_RESULT" ||
      notification.targetType === "PATIENT"
    ) {
      computedAction = PROVIDER_NOTIFICATION_ACTIONS.OPEN_PATIENT;
    } else if (notification.targetType === "URGENT_CARE") {
      computedAction = PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE;
    } else if (notification.targetType === "SCHOOL") {
      computedAction = PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL;
    }
  }

  if (!computedAction || !validActions.includes(computedAction)) return null;

  const validActionKey =
    computedAction as keyof typeof providerNotificationRouteConfig;
  const generator = providerNotificationRouteConfig[validActionKey];
  return generator(
    computedAction === PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL ||
      computedAction === PROVIDER_NOTIFICATION_ACTIONS.OPEN_SCHOOL_PATIENTS
      ? notification.targetSchoolId
      : notification.targetId,
  );
}

const curatorNotificationRouteConfig = {
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL]: (id: string | number) =>
    DYNAMIC_ROUTES.curator.schoolDetails(id),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER]: (id: string | number) =>
    `${ROUTES.curator.providers}?providerModal=${id}`,
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT]: (
    schoolId: string | number,
    patientId: string | number,
  ) => DYNAMIC_ROUTES.curator.patientDetails(schoolId, patientId),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER]: () => ROUTES.curator.partners,
};

export function getCuratorNotificationRoute(notification: CuratorNotification) {
  let computedAction = notification.action as string;
  const validActions = VALID_CURATOR_NOTIFICATION_ACTIONS as string[];

  // Compute action based on the notification data if the backend action is not a valid enum
  if (!computedAction || !validActions.includes(computedAction)) {
    const type = notification.type;
    const targetType = notification.relatedEntityType;

    if (
      type === "NEW_PATIENT_ADDED" ||
      type === "PATIENT_LOCK_IN" ||
      type === "PATIENT_REFERRED" ||
      targetType === "PATIENT_RESULT" ||
      targetType === "PATIENT"
    ) {
      computedAction = CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT;
    } else if (
      type === "PROVIDER_REGISTRATION" ||
      type === "PROVIDER_APPLICATION_UPDATE" ||
      type === "PROVIDER_SCHOOL_CHANGE" ||
      targetType === "PROVIDER" ||
      targetType === "USER"
    ) {
      computedAction = CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER;
    } else if (
      type === "SCHOOL_REGISTRATION" ||
      type === "OPEN_PATIENTS_AVAILABLE" ||
      type === "CRITICAL_ALERT" ||
      targetType === "SCHOOL"
    ) {
      computedAction = CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL;
    }
  }

  if (!computedAction || !validActions.includes(computedAction)) return null;

  const validAction =
    computedAction as keyof typeof curatorNotificationRouteConfig;
  const generator = curatorNotificationRouteConfig[validAction];
  if (computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT) {
    return generator(notification.schoolId, notification.relatedEntityId);
  }
  if (computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER) {
    return (generator as () => string)();
  }
  // For provider notifications, use targetEmail if available, otherwise fall back to relatedEntityId
  const providerIdentifier =
    computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER
      ? notification.targetEmail || notification.relatedEntityId
      : notification.relatedEntityId;
  return (generator as (id: string | number) => string)(providerIdentifier);
}
