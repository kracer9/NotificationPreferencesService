import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import NotificationPreferenceEntity from "./NotificationPreferenceEntity.ts";

@Entity({ name: 'users' })
export default class UserEntity {
    @PrimaryColumn()
    id: number;

    @Column({ nullable: true })
    timezone: string;

    @Column({
        type: 'time',
        nullable: true,
    })
    quietHoursStart: string;

    @Column({
        type: 'time',
        nullable: true,
    })
    quietHoursEnd: string;

    @OneToMany(
        () => NotificationPreferenceEntity,
        (preference) => preference.user,
    )
    preferences: NotificationPreferenceEntity[];
}
