import { afterAll, describe, test, expect } from "vitest";
import { DateTime } from "luxon";
import { initializeRepository } from "../../services/RepositoryProvider.ts";
import EvaluationService from "../../services/Evaluation/EvaluationService.ts";
import type EvaluateRequestDTO from "../../dto/EvaluateRequestDTO.ts";
import UserPreferences from "../../domain/UserPreferences.ts";
import QuietHours from "../../domain/QuietHours.ts";
import NotificationPreference from "../../domain/NotificationPreference.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";
import RegionPolicy from "../../domain/RegionPolicy.ts";

const repo = await initializeRepository();

describe('evaluation service', async () => {
    afterAll(async () => {
        await repo.transaction.rollback();
    });

    await repo.transaction.start();

    await repo.saveGlobalPolicies(new GlobalPolicies([
        new RegionPolicy({
            region: 'Asia',
            type: 'marketing',
            channel: 'push',
            enabled: false,
        }),
    ]));

    await repo.saveUserPreferences(new UserPreferences({
        userId: -1,
        quietHours: new QuietHours({
            start: '23:00',
            end: '09:00',
            timezone: 'Europe/Moscow',
        }),
        preferences: [
            new NotificationPreference({
                type: 'transactional',
                channel: 'email',
                enabled: true,
            }),
            new NotificationPreference({
                type: 'marketing',
                channel: 'sms',
                enabled: false,
            }),
            new NotificationPreference({
                type: 'marketing',
                channel: 'push',
                enabled: true,
            }),
        ],
    }));

    const service = new EvaluationService();

    const data: EvaluateRequestDTO = {
        userId: -1,
        region: 'EU',
        type: 'transactional',
        channel: 'email',
        datetime: DateTime.fromISO('2026-05-21T19:00:00Z'), // 2026-05-21T22:00:00.000+03:00
    };

    test('should allow notification', async () => {
        expect(await service.evaluate(data)).toMatchObject({
            decision: 'allow',
        });
    });

    test('should allow transactional notification in quiet hours', async () => {
        expect(await service.evaluate({
            ...data,
            type: 'transactional',
            datetime: DateTime.fromISO('2026-05-21T21:30:00Z'), // 2026-05-22T00:30:00.000+03:00
        })).toMatchObject({
            decision: 'allow',
        });
    });

    test('should deny marketing notification in quiet hours', async () => {
        expect(await service.evaluate({
            ...data,
            type: 'marketing',
            datetime: DateTime.fromISO('2026-05-21T21:30:00Z'), // 2026-05-22T00:30:00.000+03:00
        })).toMatchObject({
            decision: 'deny',
            reason: 'blocked_by_user_quiet_hours',
        });
    });

    test('should deny sms notification by user preferences', async () => {
        expect(await service.evaluate({
            ...data,
            channel: 'sms',
        })).toMatchObject({
            decision: 'deny',
            reason: 'blocked_by_user_notification_preferences',
        });
    });

    test('should deny push in Asia region by global policies', async () => {
        expect(await service.evaluate({
            ...data,
            region: 'Asia',
            type: 'marketing',
            channel: 'push',
        })).toMatchObject({
            decision: 'deny',
            reason: 'blocked_by_global_policy',
        });
    });
});
