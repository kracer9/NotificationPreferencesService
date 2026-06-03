import type { NotificationChannel, NotificationType } from "../domain/NotificationPreference.ts";

export default interface PutNotificationPreferenceDTO {
    type: NotificationType;
    channel: NotificationChannel;
    enabled: boolean;
};
