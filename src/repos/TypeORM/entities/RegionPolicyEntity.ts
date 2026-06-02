import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import NotificationPreferenceTuple from "./NotificationPreferenceTuple.ts";

@Entity({ name: 'region_policies' })
export default class RegionPolicyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    region: string;

    @Column(() => NotificationPreferenceTuple)
    preference: NotificationPreferenceTuple;
}
