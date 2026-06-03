import type PostUserPreferencesDTO from "../dto/PostUserPreferencesDTO.ts";
import UserPreferences, { type UserPreferencesData } from "../domain/UserPreferences.ts";
import type RepositoryInterface from "./RepositoryInterface.ts";
import { provideRepository } from "./RepositoryProvider.ts";
import QuietHours from "../domain/QuietHours.ts";
import NotificationPreference from "../domain/NotificationPreference.ts";

export default class UserService {
    private repo: RepositoryInterface;

    public constructor() {
        this.repo = provideRepository();
    }

    public async getUserPreferences(userId: number): Promise<UserPreferences> {
        const user = await this.repo.userPreferences.get(userId);
        if (!user) {
            throw new Error(`Не найден пользователь ${userId}`);
        }
        return user;
    }

    public async postUserPreferences(userId: number, data: PostUserPreferencesDTO): Promise<UserPreferences> {
        let user = await this.repo.userPreferences.get(userId);
        if (!user) {
            return await this.createUserPreferences(userId, data);
        } else {
            return await this.updateUserPreferences(user, data);
        }
    }

    private async createUserPreferences(userId: number, data: PostUserPreferencesDTO): Promise<UserPreferences> {
        const userData: UserPreferencesData = {
            userId: userId,
            quietHours: undefined,
            preferences: undefined,
        };

        if (data.quietHours) {
            userData.quietHours = new QuietHours(data.quietHours);
        }

        if (data.preferences) {
            userData.preferences = this.factoryPreferences(data);
        } else {
            userData.preferences = await this.getDefaultPreferences();
        }

        const user = new UserPreferences(userData);
        return await this.repo.userPreferences.save(user);
    }

    private async updateUserPreferences(user: UserPreferences, data: PostUserPreferencesDTO): Promise<UserPreferences> {
        if (data.quietHours) {
            user.setQuietHours(new QuietHours(data.quietHours));
        }

        if (data.preferences) {
            user.setPreferences(this.factoryPreferences(data));
        }

        return await this.repo.userPreferences.save(user);
    }

    private factoryPreferences(data: PostUserPreferencesDTO): NotificationPreference[] {
        if (!data.preferences) {
            return [];
        }
        return data.preferences.map(item => {
            return new NotificationPreference(item);
        });
    }

    private async getDefaultPreferences(): Promise<NotificationPreference[]> {
        const defaults = await this.repo.defaultPreferences.get();

        return defaults.getPreferences().map(item => {
            return new NotificationPreference(item.preference);
        });
    }
}
