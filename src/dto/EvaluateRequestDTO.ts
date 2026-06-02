import { DateTime } from "luxon";
import type { NotificationType, NotificationChannel } from "../domain/NotificationPreference.ts";

export default interface EvaluateRequestDTO {
    userId: number;
    type: NotificationType;
    channel: NotificationChannel;
    region: string;
    datetime: DateTime;
};
