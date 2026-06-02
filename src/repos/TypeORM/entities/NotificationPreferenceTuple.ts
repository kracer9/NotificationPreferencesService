import { Column } from "typeorm";
import type { NotificationType, NotificationChannel } from "../../../domain/NotificationPreference.ts";

export default class NotificationPreferenceTuple {
    @Column({
        type: 'enum',
        enum: ['transactional', 'marketing'],
    })
    type: NotificationType;

    @Column({
        type: 'enum',
        enum: ['email', 'sms', 'push'],
    })
    channel: NotificationChannel

    @Column()
    enabled: boolean;
}
