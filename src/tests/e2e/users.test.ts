import { test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import { provideRepository } from "../../services/RepositoryProvider.ts";
import type PostUserPreferencesDTO from "../../dto/PostUserPreferencesDTO.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import DefaultPreference from "../../domain/DefaultPreference.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";

const repo = provideRepository();

beforeAll(async () => {
    await repo.transaction.start();
});

afterAll(async () => {
    await repo.transaction.rollback();
});

const mockDefaultPreferences = new DefaultPreferences([]);
const mockGlobalPolicies = new GlobalPolicies([]);

repo.defaultPreferences.get = async () => mockDefaultPreferences;
repo.globalPolicies.get = async () => mockGlobalPolicies;

interface PostUserRequestData {
    userId: number;
    userPreferences: PostUserPreferencesDTO;
};

const dataset: PostUserRequestData[] = [
    {
        userId: -1,
        userPreferences: {},
    },
    {
        userId: -2,
        userPreferences: {},
    },
    {
        userId: -3,
        userPreferences: {
            quietHours: {
                start: '22:00',
                end: '10:00',
                timezone: 'Europe/Moscow',
            },
        },
    },
    {
        userId: -4,
        userPreferences: {
            preferences: [{
                type: 'transactional',
                channel: 'push',
                enabled: true,
            }],
        },
    },
    {
        userId: -5,
        userPreferences: {
            quietHours: {
                start: '22:00',
                end: '10:00',
                timezone: 'Europe/Moscow',
            },
            preferences: [{
                type: 'transactional',
                channel: 'push',
                enabled: true,
            }, {
                type: 'marketing',
                channel: 'push',
                enabled: true,
            }],
        },
    },
];

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

    response = await request(app)
        .get(`/users/${userId}/preferences`);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences).toBeUndefined();
});

test('post new user request with empty preferences and defined defaults', async () => {
    const { userId, userPreferences } = dataset[1];

    mockDefaultPreferences.setPreferences([
        new DefaultPreference({
            type: 'marketing',
            channel: 'push',
            enabled: true,
        }),
    ]);

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences).toBeInstanceOf(Array);
    expect(response.body.preferences[0]).toMatchObject({
        type: 'marketing',
        channel: 'push',
        enabled: true,
    });

    response = await request(app)
        .get(`/users/${userId}/preferences`);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences).toBeInstanceOf(Array);
    expect(response.body.preferences[0]).toMatchObject({
        type: 'marketing',
        channel: 'push',
        enabled: true,
    });

    mockDefaultPreferences.setPreferences([]);
});

test('post new user request with quiet hours', async () => {
    const { userId, userPreferences } = dataset[2];

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours.end).toBe('10:00');
    expect(response.body.preferences).toBeUndefined();

    response = await request(app)
        .get(`/users/${userId}/preferences`);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours.end).toBe('10:00');
    expect(response.body.preferences).toBeUndefined();
});

test('post new user request with notification preferences', async () => {
    const { userId, userPreferences } = dataset[3];

    let response = await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences.length).toBe(1);

    response = await request(app)
        .get(`/users/${userId}/preferences`);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.quietHours).toBeUndefined();
    expect(response.body.preferences.length).toBe(1);
});

test('post same user request two times should get the same result', async () => {
    const { userId, userPreferences } = dataset[4];

    await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);

    const response1 = await request(app)
        .get(`/users/${userId}/preferences`);

    await request(app)
        .post(`/users/${userId}/preferences`)
        .set('Accept', 'application/json')
        .send(userPreferences);

    const response2 = await request(app)
        .get(`/users/${userId}/preferences`)

    expect(response1.body).toMatchObject(response2.body);
});
