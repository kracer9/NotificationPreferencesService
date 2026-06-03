import type RepositoryInterface from "./RepositoryInterface.ts";
import PostgresDataSource from "../repos/TypeORM/PostgresDataSource.ts";
import Transaction from "../repos/TypeORM/Transaction.ts";
import UserPreferencesRepository from "../repos/TypeORM/UserPreferencesRepository.ts";
import DefaultPreferencesRepository from "../repos/yaml/DefaultPreferencesRepository.ts";
import GlobalPoliciesRepository from "../repos/yaml/GlobalPoliciesRepository.ts";

let repository: RepositoryInterface;

export class NotInitializedRepository extends Error {};

export async function initializeRepository(): Promise<RepositoryInterface> {
    if (repository) return repository;

    await PostgresDataSource.initialize();

    const queryRunner = PostgresDataSource.createQueryRunner();
    const manager = queryRunner.manager;
    const transaction = new Transaction(queryRunner);

    repository = {
        transaction: transaction,
        userPreferences: new UserPreferencesRepository(manager, transaction),
        defaultPreferences: new DefaultPreferencesRepository(),
        globalPolicies: new GlobalPoliciesRepository(),
    };

    return repository;
}

export function provideRepository(): RepositoryInterface {
    if (!repository) {
        throw new NotInitializedRepository('Репозиторий не инициализирован');
    }
    return repository;
}
