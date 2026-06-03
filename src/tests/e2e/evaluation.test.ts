import { describe, test, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import { provideRepository } from "../../services/RepositoryProvider.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";
import RegionPolicy from "../../domain/RegionPolicy.ts";

const repo = provideRepository();

const mockGlobalPolicies = new GlobalPolicies([
    new RegionPolicy({
        region: 'EU',
        type: 'marketing',
        channel: 'push',
        enabled: false,
    }),
]);
repo.globalPolicies.get = async () => mockGlobalPolicies;

const userData = {
    userId: -1,
    userPreferences: {
        quietHours: {
            start: '23:00',
            end: '09:00',
            timezone: 'Europe/Moscow',
        },
        preferences: [{
            type: 'transactional',
            channel: 'email',
            enabled: true,
        }, {
            type: 'marketing',
            channel: 'email',
            enabled: true,
        }, {
            type: 'marketing',
            channel: 'sms',
            enabled: false,
        }, {
            type: 'marketing',
            channel: 'push',
            enabled: true,
        }],
    },
};

const dataset = [{
    descr: 'should return user not found error',
    data: {
        userId: 0,
        region: 'EU',
        type: 'transactional',
        channel: 'email',
        datetime: '2026-05-21T19:00:00Z',
    },
    result: {
        error: 'user_not_found',
    },
    statusCode: 404,
}, {
    descr: 'should allow notification',
    data: {
        userId: -1,
        region: 'EU',
        type: 'transactional',
        channel: 'email',
        datetime: '2026-05-21T19:00:00Z',
    },
    result: {
        decision: 'allow',
    },
    statusCode: 200,
}, {
    descr: 'should deny by user quiet hours',
    data: {
        userId: -1,
        region: 'EU',
        type: 'marketing',
        channel: 'email',
        datetime: '2026-05-21T21:00:00Z',
    },
    result: {
        decision: 'deny',
        reason: 'blocked_by_user_quiet_hours',
    },
    statusCode: 200,
}, {
    descr: 'should deny by user notification preferences',
    data: {
        userId: -1,
        region: 'EU',
        type: 'marketing',
        channel: 'sms',
        datetime: '2026-05-21T19:00:00Z',
    },
    result: {
        decision: 'deny',
        reason: 'blocked_by_user_notification_preferences',
    },
    statusCode: 200,
}, {
    descr: 'should deny by user quiet hours',
    data: {
        userId: -1,
        region: 'EU',
        type: 'marketing',
        channel: 'push',
        datetime: '2026-05-21T17:00:00Z',
    },
    result: {
        decision: 'deny',
        reason: 'blocked_by_global_policy',
    },
    statusCode: 200,
}];

describe('evaluate request', async () => {
    afterAll(async () => {
        await repo.transaction.rollback();
    });

    await repo.transaction.start();

    await request(app)
        .post(`/users/${userData.userId}/preferences`)
        .accept('application/json')
        .send(userData.userPreferences);

    test.each(dataset)('$descr', async ({ data, result, statusCode }) => {
        await request(app)
            .post('/evaluate')
            .accept('application/json')
            .send(data)
            .expect(statusCode, result);
    });
});
