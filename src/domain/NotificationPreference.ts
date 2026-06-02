export type NotificationType = 'transactional' | 'marketing';

export type NotificationChannel = 'email' | 'sms' | 'push';

export type NotificationPreferenceSymbol = `${NotificationType}_${NotificationChannel}`;

export interface NotificationPreferenceData {
    id?: number;
    type: NotificationType;
    channel: NotificationChannel;
    enabled: boolean;
};

export type NotificationPreferenceValueData = Omit<NotificationPreferenceData, 'id'>;

export default class NotificationPreference {
    public id?: number;
    private value: NotificationPreferenceValue;

    public constructor(data: NotificationPreferenceData) {
        this.setData(data);
    }

    public setData(data: NotificationPreferenceData) {
        this.id = data.id;
        this.setValue(data);
    }

    private setValue(data: NotificationPreferenceValueData) {
        this.value = new NotificationPreferenceValue(data);
    }

    public get data(): NotificationPreferenceData {
        return {
            id: this.id,
            ...this.value.data,
        };
    }

    public get type(): NotificationType {
        return this.value.type;
    }

    public get channel(): NotificationChannel {
        return this.value.channel;
    }

    public get enabled(): boolean {
        return this.value.enabled;
    }

    public set enabled(enabled: boolean) {
        this.setValue({ ...this.value.data, enabled });
    }

    public get symbol(): NotificationPreferenceSymbol {
        return this.value.symbol;
    }
}

export class NotificationPreferenceValue {
    private _type: NotificationType;
    private _channel: NotificationChannel;
    private _enabled: boolean;

    public constructor(data: NotificationPreferenceValueData) {
        this.setData(data);
    }

    private setData(data: NotificationPreferenceValueData) {
        this._type = data.type;
        this._channel = data.channel;
        this._enabled = data.enabled;
    }

    public get data() {
        return {
            type: this._type,
            channel: this._channel,
            enabled: this._enabled,
        };
    }

    public get type(): NotificationType {
        return this._type;
    }

    public get channel(): NotificationChannel {
        return this._channel;
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public get symbol(): NotificationPreferenceSymbol {
        return `${this._type}_${this._channel}`;
    }
}
