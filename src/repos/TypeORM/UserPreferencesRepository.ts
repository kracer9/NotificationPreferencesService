import { type EntityManager } from "typeorm";
import type { UserPreferencesRepositoryInterface } from "../../services/RepositoryInterface.ts";
import Transaction from "./Transaction.ts";
import NotificationPreference from "../../domain/NotificationPreference.ts";
import NotificationPreferenceEntity from "./entities/NotificationPreferenceEntity.ts";
import UserPreferences, { type UserPreferencesData } from "../../domain/UserPreferences.ts";
import UserEntity from "./entities/UserEntity.ts";
import QuietHours from "../../domain/QuietHours.ts";
import NotFound from "../../errors/NotFound.ts";

export default class UserPreferencesRepository implements UserPreferencesRepositoryInterface {
    private manager: EntityManager;
    private transaction: Transaction;

    public constructor(manager: EntityManager, transaction: Transaction) {
        this.manager = manager;
        this.transaction = transaction;
    }

    public async save(user: UserPreferences): Promise<UserPreferences> {
        const data = new UserEntity();
        data.id = user.userId;

        if (user.quietHours) {
            const quietHours = user.quietHours.data;
            data.quietHoursStart = quietHours.start;
            data.quietHoursEnd = quietHours.end;
            data.timezone = quietHours.timezone;
        }

        data.preferences = user.preferences.map(preference => {
            const item = new NotificationPreferenceEntity();
            if (preference.id) {
                item.id = preference.id;
            }
            item.type = preference.type;
            item.channel = preference.channel;
            item.enabled = preference.enabled;
            return item;
        });

        await this.transaction.run(async () => {
            await this.manager.save(data.preferences);
            await this.manager.save(data);
        });

        const updatedUser = await this.get(user.userId);
        if (!updatedUser) {
            throw new NotFound('user_not_found');
        }

        return updatedUser;
    }

    public async get(userId: number): Promise<UserPreferences | undefined> {
        const data = await this.manager.findOne(UserEntity, {
            where: { id: userId },
            relations: { preferences: true },
        });

        if (!data) {
            return undefined;
        }

        const userData: UserPreferencesData = {
            userId: data.id,
            quietHours: undefined,
            preferences: [],
        };

        if (data.quietHoursStart && data.quietHoursEnd) {
            userData.quietHours = new QuietHours({
                start: data.quietHoursStart,
                end: data.quietHoursEnd,
                timezone: data.timezone
            });
        }

        if (data.preferences) {
            userData.preferences = data.preferences.map(item => {
                return new NotificationPreference(item);
            });
        }

        return new UserPreferences(userData);
    }
}
