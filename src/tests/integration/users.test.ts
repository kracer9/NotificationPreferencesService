import { afterAll, describe, test, expect } from "vitest";
import { initializeRepository } from "../../services/RepositoryProvider.ts";
import UserService from "../../services/UserService.ts";
import UserPreferences from "../../domain/UserPreferences.ts";
import QuietHours from "../../domain/QuietHours.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import DefaultPreference from "../../domain/DefaultPreference.ts";

const repo = await initializeRepository();

repo.defaultPreferences.get = async () => {
    return new DefaultPreferences([
        new DefaultPreference({
            type: 'transactional',
            channel: 'sms',
            enabled: true,
        }),
        new DefaultPreference({
            type: 'marketing',
            channel: 'email',
            enabled: false,
        }),
    ]);
};

describe('user service', async () => {
    afterAll(async () => {
        await repo.transaction.rollback();
    });

    await repo.transaction.start();

    const service = new UserService();
    const userId = -1;

    test('post new user, should create record with default preferences', async () => {
        const user = await service.postUserPreferences(userId, {});

        expect(user).toBeInstanceOf(UserPreferences);
        expect(user.userId).toBe(userId);
        expect(user.quietHours).toBeUndefined();
        expect(user.preferences).toBeInstanceOf(Array);
        expect(user.preferences.length).toBe(2);
        expect(user.preferences[0].data).toMatchObject({
            type: 'transactional',
            channel: 'sms',
            enabled: true,
        });
        expect(user.preferences[1].data).toMatchObject({
            type: 'marketing',
            channel: 'email',
            enabled: false,
        });
    });

    test('get with wrong id should throw error', async () => {
        await expect(service.getUserPreferences(-2)).rejects.toThrow(Error);
    });

    test('get should return data', async () => {
        const user = await service.getUserPreferences(userId);

        expect(user).toBeInstanceOf(UserPreferences);
        expect(user.userId).toBe(userId);
        expect(user.quietHours).toBeUndefined();
        expect(user.preferences).toBeInstanceOf(Array);
        expect(user.preferences.length).toBe(2);
        expect(user.preferences[0].data).toMatchObject({
            type: 'transactional',
            channel: 'sms',
            enabled: true,
        });
        expect(user.preferences[1].data).toMatchObject({
            type: 'marketing',
            channel: 'email',
            enabled: false,
        });
    });

    test('post quiet hours', async () => {
        const user = await service.postUserPreferences(userId, {
            quietHours: {
                start: '00:00',
                end: '10:00',
                timezone: 'Asia/Yekaterinburg',
            }
        });

        expect(user).toBeInstanceOf(UserPreferences);
        expect(user.userId).toBe(userId);
        expect(user.preferences).toBeInstanceOf(Array);
        expect(user.preferences.length).toBe(2);
        expect(user.quietHours).toBeInstanceOf(QuietHours);
        expect(user.quietHours?.data).toMatchObject({
            start: '00:00',
            end: '10:00',
            timezone: 'Asia/Yekaterinburg',
        });
    });

    test('post changed quiet hours', async () => {
        const user = await service.postUserPreferences(userId, {
            quietHours: {
                start: '01:00',
                end: '10:00',
                timezone: 'Europe/Moscow',
            }
        });

        expect(user).toBeInstanceOf(UserPreferences);
        expect(user.quietHours?.data).toMatchObject({
            start: '01:00',
            end: '10:00',
            timezone: 'Europe/Moscow',
        });
    });

    test('post changed preferences', async () => {
        const user = await service.postUserPreferences(userId, {
            preferences: [{
                type: 'transactional',
                channel: 'push',
                enabled: true,
            }],
        });

        expect(user.preferences.length).toBe(1);
        expect(user.preferences[0].id).toBeGreaterThan(0);
        expect(user.preferences[0]).toMatchObject({
            type: 'transactional',
            channel: 'push',
            enabled: true,
        });
    });
});
