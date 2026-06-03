import QuietHours, { type QuietHoursData } from "./QuietHours.ts";
import NotificationPreference from "./NotificationPreference.ts";
import type {
    NotificationChannel, NotificationPreferenceData,
    NotificationPreferenceSymbol, NotificationType,
} from "./NotificationPreference.ts";

export interface UserPreferencesData {
    userId: number;
    quietHours?: QuietHours;
    preferences?: NotificationPreference[];
};

export interface UserPreferencesRawData {
    userId: number;
    quietHours?: QuietHoursData;
    preferences?: NotificationPreferenceData[];
}

export default class UserPreferences {
    private _userId: number;
    private _quietHours?: QuietHours;
    private _preferences: Map<NotificationPreferenceSymbol, NotificationPreference>;

    public constructor(data: UserPreferencesData) {
        this._userId = data.userId;
        this.setQuietHours(data.quietHours);
        this.setPreferences(data.preferences ?? []);
    }

    public get data(): UserPreferencesRawData {
        return {
            userId: this._userId,
            quietHours: this._quietHours?.data,
            preferences: this._preferences.size > 0
                ? this.preferences.map(item => item.data)
                : undefined,
        };
    }

    public get userId(): number {
        return this._userId;
    }

    public get quietHours(): QuietHours | undefined {
        return this._quietHours;
    }

    public get preferences(): NotificationPreference[] {
        return [...this._preferences.values()];
    }

    public getPreference(
        type: NotificationType,
        channel: NotificationChannel,
    ): NotificationPreference | undefined {
        return this._preferences.get(`${type}_${channel}`);
    }

    public setQuietHours(quietHours: QuietHours | undefined) {
        this._quietHours = quietHours;
    }

    public setPreferences(preferences: NotificationPreference[]) {
        if (!this._preferences) {
            this.initPreferencesMap(preferences);
        } else {
            this.updatePreferencesMap(preferences);
        }
    }

    public setPreference(preference: NotificationPreference) {
        this.storePreference(preference);
    }

    private initPreferencesMap(preferences: NotificationPreference[]) {
        this._preferences = new Map(preferences.map(preference => {
            return [preference.symbol, preference];
        }));
    }

    private updatePreferencesMap(preferences: NotificationPreference[]) {
        preferences.forEach(this.storePreference.bind(this));
    }

    private storePreference(preference: NotificationPreference) {
        const oldPreference = this._preferences.get(preference.symbol);

        if (!oldPreference) {
            this._preferences.set(preference.symbol, preference);
            return;
        }

        oldPreference.id = oldPreference.id ?? preference.id;
        oldPreference.enabled = preference.enabled;
    }
}
