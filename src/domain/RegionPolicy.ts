import { NotificationPreferenceValue } from "./NotificationPreference.ts";
import type { NotificationPreferenceSymbol, NotificationPreferenceValueData } from "./NotificationPreference.ts";

export type RegionPolicySymbol = `${string}_${NotificationPreferenceSymbol}`;

export interface RegionPolicyData extends NotificationPreferenceValueData {
    id?: number;
    region: string;
};

export default class RegionPolicy {
    public id: number | undefined;
    public preference: NotificationPreferenceValue;

    private _region: string;

    constructor(data: RegionPolicyData) {
        this.id = data.id;
        this._region = data.region;
        this.preference = new NotificationPreferenceValue(data);
    }

    public get region(): string {
        return this._region;
    }

    public get symbol(): RegionPolicySymbol {
        return `${this.region}_${this.preference.symbol}`;
    }
}
