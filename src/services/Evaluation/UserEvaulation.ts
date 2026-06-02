import type { DateTime } from "luxon";
import type UserPreferences from "../../domain/UserPreferences.ts";
import type { NotificationChannel, NotificationType } from "../../domain/NotificationPreference.ts";

export default class UserEvaluation {
    private user: UserPreferences;

    public constructor(user: UserPreferences) {
        this.user = user;
    }

    public checkPreferences(type: NotificationType, channel: NotificationChannel): boolean {
        const preference = this.user.getPreference(type, channel);
        if (!preference) return false;
        return preference.enabled;
    }

    public checkQuietHours(datetime: DateTime, type: NotificationType): boolean {
        const allowedTypes = ['transactional'];

        if (allowedTypes.includes(type)) {
            return true;
        }
        if (!this.user.quietHours) {
            return true;
        }

        return !this.user.quietHours.includes(datetime);
    }
}
