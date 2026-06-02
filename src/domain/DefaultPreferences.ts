import type DefaultPreference from "./DefaultPreference.ts";
import type { NotificationPreferenceSymbol } from "./NotificationPreference.ts";

export default class DefaultPreferences {
    private preferences: Map<NotificationPreferenceSymbol, DefaultPreference>;

    public constructor(preferences: DefaultPreference[]) {
        this.setPreferences(preferences);
    }

    public setPreferences(preferences: DefaultPreference[]) {
        this.preferences = new Map(preferences.map(item => {
            return [item.preference.symbol, item];
        }));
    }

    public getPreferences(): DefaultPreference[] {
        return [...this.preferences.values()];
    }
}
