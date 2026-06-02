import type { QueryRunner } from "typeorm";
import type { TransactionInterface, runInTransaction } from "../../services/RepositoryInterface.ts";

export default class Transaction implements TransactionInterface {
    private queryRunner: QueryRunner;

    public constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    public async run(fn: runInTransaction): Promise<void> {
        await this.queryRunner.manager.transaction(fn);
    }

    public async start(): Promise<void> {
        await this.queryRunner.startTransaction();
    }

    public async commit(): Promise<void> {
        await this.queryRunner.commitTransaction();
    }

    public async rollback(): Promise<void> {
        await this.queryRunner.rollbackTransaction();
    }
}
