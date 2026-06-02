import type { QuietHoursData } from "../domain/QuietHours.ts";
import type { NotificationPreferenceData } from "../domain/NotificationPreference.ts";

export default interface PostUserPreferencesDTO {
    quietHours?: QuietHoursData;
    preferences?: NotificationPreferenceData[];
};
