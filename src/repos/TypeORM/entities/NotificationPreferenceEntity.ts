import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import NotificationPreferenceTuple from "./NotificationPreferenceTuple.ts";
import UserEntity from "./UserEntity.ts";

@Entity({ name: 'notification_preferences' })
export default class NotificationPreferenceEntity extends NotificationPreferenceTuple {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.preferences)
    @JoinColumn()
    user: UserEntity;
}
