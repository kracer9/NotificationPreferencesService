import { test, expect } from "vitest";
import type RepositoryInterface from "../../services/RepositoryInterface.ts";
import { provideRepository, initializeRepository, NotInitializedRepository } from "../../services/RepositoryProvider.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";

let repo: RepositoryInterface;

test('provide uninitialized repository will throw error', () => {
    expect(() => provideRepository()).toThrow(NotInitializedRepository);
});

test('initialize repository', async () => {
    repo = await initializeRepository();
    expect(repo).not.toBeUndefined();
});

test('initialize repository second time just return it', async () => {
    repo = await initializeRepository();
    expect(repo).not.toBeUndefined();
});

test('get user preferences', async () => {
    const userPreferences = await repo.userPreferences.get(0);
    expect(userPreferences).toBeUndefined();
});

test('get default preferences', async () => {
    const defaultPreferences = await repo.defaultPreferences.get();
    expect(defaultPreferences).toBeInstanceOf(DefaultPreferences);
});

test('get global policies', async () => {
    const globalPolicies = await repo.globalPolicies.get();
    expect(globalPolicies).toBeInstanceOf(GlobalPolicies);
});
