import { test, expect } from "vitest";
import type RepositoryInterface from "../../services/RepositoryInterface.ts";
import { initializeRepository } from "../../services/RepositoryProvider.ts";
import DefaultPreferences from "../../domain/DefaultPreferences.ts";
import GlobalPolicies from "../../domain/GlobalPolicies.ts";

let repo: RepositoryInterface;

test('initialize repository', async () => {
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
