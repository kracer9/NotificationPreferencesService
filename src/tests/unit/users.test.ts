import { test, expect } from "vitest";
import UserPreferences from "../../domain/UserPreferences.ts";
import QuietHours from "../../domain/QuietHours.ts";
import NotificationPreference from "../../domain/NotificationPreference.ts";

test('empty user preferences aggregate', () => {
    const user = new UserPreferences({ userId: 1 });

    expect(user.userId).toBe(1);
    expect(user.quietHours).toBeUndefined();
    expect(user.preferences).toBeInstanceOf(Array);
    expect(user.preferences.length).toBe(0);
});

test('user preferences aggregate with quiet hours value object', () => {
    const user = new UserPreferences({
        userId: 1,
        quietHours: new QuietHours({
            start: '23:00',
            end: '09:00',
            timezone: 'Europe/Moscow',
        }),
    });
    expect(user.quietHours).toBeInstanceOf(QuietHours);
    expect(user.quietHours?.data.start).toBe('23:00');
    expect(user.quietHours?.data.end).toBe('09:00');
    expect(user.quietHours?.data.timezone).toBe('Europe/Moscow');

    user.setQuietHours(new QuietHours({
        start: '22:00',
        end: '08:00',
        timezone: 'Asia/Yekaterinburg',
    }));
    expect(user.quietHours).toBeInstanceOf(QuietHours);
    expect(user.quietHours?.data.start).toBe('22:00');
    expect(user.quietHours?.data.end).toBe('08:00');
    expect(user.quietHours?.data.timezone).toBe('Asia/Yekaterinburg');
});

test('user preferences aggregate with notification preferences', () => {
    const user = new UserPreferences({
        userId: 1,
        preferences: [
            new NotificationPreference({
                type: 'transactional',
                channel: 'email',
                enabled: true,
            }),
            new NotificationPreference({
                type: 'marketing',
                channel: 'email',
                enabled: false,
            }),
        ],
    });

    expect(user.preferences.length).toBe(2);
    expect(user.preferences[0]).toBeInstanceOf(NotificationPreference);
    expect(user.preferences[0].type).toBe('transactional');
    expect(user.preferences[0].channel).toBe('email');

    expect(user.getPreference('marketing', 'sms')).toBeUndefined();
    expect(user.getPreference('marketing', 'email')).toBeInstanceOf(NotificationPreference);
});

test('user preferences aggregate can change inner preferences collection', () => {
    const user = new UserPreferences({
        userId: 1,
        preferences: [
            new NotificationPreference({
                type: 'transactional',
                channel: 'email',
                enabled: true,
            }),
            new NotificationPreference({
                type: 'marketing',
                channel: 'email',
                enabled: false,
            }),
        ],
    });

    user.setPreferences([
        new NotificationPreference({
            type: 'transactional',
            channel: 'push',
            enabled: true,
        }),
    ]);

    expect(user.preferences.length).toBe(1);
    expect(user.preferences[0].type).toBe('transactional');
    expect(user.preferences[0].channel).toBe('push');
});
