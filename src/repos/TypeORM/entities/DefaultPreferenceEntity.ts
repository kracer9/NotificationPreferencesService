import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import NotificationPreferenceTuple from "./NotificationPreferenceTuple.ts";

@Entity({ name: 'default_preferences' })
export default class DefaultPreferenceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => NotificationPreferenceTuple)
    preference: NotificationPreferenceTuple;
}
