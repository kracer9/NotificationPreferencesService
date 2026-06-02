import { test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import { provideRepository } from "../../services/RepositoryProvider.ts";
import type PostUserPreferencesDTO from "../../dto/PostUserPreferencesDTO.ts";

const repo = provideRepository();

beforeAll(async () => {
    await repo.transaction.start();
});

afterAll(async () => {
    await repo.transaction.rollback();
});

interface PostUserRequestData {
    userId: number;
    userPreferences: PostUserPreferencesDTO;
};

const dataset: PostUserRequestData[] = [{
    userId: -1,
    userPreferences: {},
}, {
    userId: -2,
    userPreferences: {
        quietHours: {
            start: '22:00',
            end: '10:00',
            timezone: 'Europe/Moscow',
        },
    },
}, {
    userId: -3,
    userPreferences: {
        preferences: [{
            type: 'transactional',
            channel: 'push',
            enabled: true,
        }],
    },
}];

test('post new user request with empty preferences', async () => {
    const { userId, userPreferences } = dataset[0];

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences).toBeUndefined();
});

test('post new user request with quiet hours', async () => {
    const { userId, userPreferences } = dataset[1];

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours.end).toBe('10:00');
    expect(response.body.preferences).toBeUndefined();
});

test('post new user request with notification preferences', async () => {
    const { userId, userPreferences } = dataset[2];

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences.length).toBe(1);
});
