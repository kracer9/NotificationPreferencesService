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

export default interface RepositoryInterface {
    transaction: TransactionInterface;

    getGlobalPolicies(): Promise<GlobalPolicies>;
    saveGlobalPolicies(globalPolicies: GlobalPolicies): Promise<GlobalPolicies>;

    getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
    saveUserPreferences(user: UserPreferences): Promise<UserPreferences>;

    getDefaultPreferences(): Promise<DefaultPreferences>;
    saveDefaultPreferences(defaultPreferences: DefaultPreferences): Promise<DefaultPreferences>;
}
