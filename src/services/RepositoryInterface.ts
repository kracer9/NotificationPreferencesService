import type DefaultPreferences from "../domain/DefaultPreferences.ts";
import type GlobalPolicies from "../domain/GlobalPolicies.ts";
import type UserPreferences from "../domain/UserPreferences.ts";

export type runInTransaction = () => Promise<void>;

export interface TransactionInterface {
    run: (fn: runInTransaction) => Promise<void>;
    start: () => Promise<void>;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
};

export interface UserPreferencesRepositoryInterface {
    save(user: UserPreferences): Promise<UserPreferences>;
    get(userId: number): Promise<UserPreferences | undefined>;
};

export interface DefaultPreferencesRepositoryInterface {
    get(): Promise<DefaultPreferences>;
};

export interface GlobalPoliciesRepositoryInterface {
    get(): Promise<GlobalPolicies>;
};

export default interface RepositoryInterface {
    transaction: TransactionInterface;
    userPreferences: UserPreferencesRepositoryInterface;
    defaultPreferences: DefaultPreferencesRepositoryInterface;
    globalPolicies: GlobalPoliciesRepositoryInterface;
}
