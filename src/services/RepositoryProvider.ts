import type RepositoryInterface from "./RepositoryInterface.ts";
import Repository from "../repos/TypeORM/Repository.ts";
import PostgresDataSource from "../repos/TypeORM/PostgresDataSource.ts";

const dataSource = PostgresDataSource;
const repository = new Repository(dataSource);

export async function initializeRepository(): Promise<RepositoryInterface> {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
    return repository;
}

export function provideRepository(): RepositoryInterface {
    return repository;
}
