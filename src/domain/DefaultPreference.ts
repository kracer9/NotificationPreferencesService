import { NotificationPreferenceValue, type NotificationPreferenceValueData } from "./NotificationPreference.ts";

export interface DefaultPreferenceData extends NotificationPreferenceValueData {
    id?: number;
};

export default class DefaultPreference {
    public id?: number;
    public preference: NotificationPreferenceValue;

    public constructor(data: DefaultPreferenceData) {
        this.id = data.id;
        this.preference = new NotificationPreferenceValue(data);
    }
};
