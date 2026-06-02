import { In, Not, type DataSource, type EntityManager, type QueryRunner } from "typeorm";
import type RepositoryInterface from "../../services/RepositoryInterface.ts";
import Transaction from "./Transaction.ts";
import RegionPolicy from "../../domain/RegionPolicy.ts";
import RegionPolicyEntity from "./entities/RegionPolicyEntity.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";
import NotificationPreference from "../../domain/NotificationPreference.ts";
import NotificationPreferenceEntity from "./entities/NotificationPreferenceEntity.ts";
import UserPreferences, { type UserPreferencesData } from "../../domain/UserPreferences.ts";
import UserEntity from "./entities/UserEntity.ts";
import QuietHours from "../../domain/QuietHours.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import DefaultPreferenceEntity from "./entities/DefaultPreferenceEntity.ts";
import DefaultPreference from "../../domain/DefaultPreference.ts";

export default class Repository implements RepositoryInterface {
    public transaction: Transaction;
    private queryRunner: QueryRunner;
    private manager: EntityManager;

    public constructor(dataSource: DataSource) {
        this.queryRunner = dataSource.createQueryRunner();
        this.manager = this.queryRunner.manager;
        this.transaction = new Transaction(this.queryRunner);
    }

    public async getGlobalPolicies(): Promise<GlobalPolicies> {
        const data = await this.manager.find(RegionPolicyEntity, {
            relations: { preference: true },
        });

        const policies = data.map(item => {
            return new RegionPolicy({
                id: item.id,
                region: item.region,
                type: item.preference.type,
                channel: item.preference.channel,
                enabled: item.preference.enabled,
            });
        });

        return new GlobalPolicies(policies);
    }

    public async saveGlobalPolicies(globalPolicies: GlobalPolicies): Promise<GlobalPolicies> {
        const data = globalPolicies.getPolicies().map(policy => {
            const item = new RegionPolicyEntity();
            if (policy.id) {
                item.id = policy.id;
            }
            item.region = policy.region;
            item.preference.type = policy.preference.type;
            item.preference.channel = policy.preference.channel;
            item.preference.enabled = policy.preference.enabled;
            return item;
        });

        await this.transaction.run(async () => {
            await this.manager.save(data.map(item => item.preference));
            await this.manager.save(data);
        });

        return await this.getGlobalPolicies();
    }

    public async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
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

    public async saveUserPreferences(user: UserPreferences): Promise<UserPreferences> {
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

        const updatedUser = await this.getUserPreferences(user.userId);
        if (!updatedUser) {
            throw new Error(`Не найден пользователь ${user.userId}`);
        }

        return updatedUser;
    }

    public async getDefaultPreferences(): Promise<DefaultPreferences> {
        const data = await this.manager.find(DefaultPreferenceEntity);

        const preferences = data.map(item => {
            return new DefaultPreference({
                id: item.id,
                ...item.preference,
            });
        });

        return new DefaultPreferences(preferences);
    }

    public async saveDefaultPreferences(defaultPreferences: DefaultPreferences): Promise<DefaultPreferences> {
        const data = defaultPreferences.getPreferences().map(defaultPreference => {
            const item = new DefaultPreferenceEntity();
            if (defaultPreference.id) item.id = defaultPreference.id;
            item.preference = defaultPreference.preference;
            return item;
        });
        const ids = data.map(item => item.id).filter(id => id);

        await this.transaction.run(async () => {
            const deleteCriteria = { id: Not(In(ids)) };
            await this.manager.delete(DefaultPreferenceEntity, deleteCriteria);
            await this.manager.save(data);
        });

        return await this.getDefaultPreferences();
    }
}
