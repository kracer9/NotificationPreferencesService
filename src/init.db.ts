import process from "process";
import { DataSource } from "typeorm";
import config from "./configs/config.ts";

async function initDatabase() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: config.db.postgres.host,
        port: config.db.postgres.port,
        username: config.db.postgres.user,
        password: config.db.postgres.pass,
    });

    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    const database = String(config.db.postgres.database);
    const schema = String(config.db.postgres.schema);

    await queryRunner.createDatabase(database, true);
    await queryRunner.createSchema(schema, true);
    await dataSource.destroy();
}

async function run() {
    await initDatabase();
    console.log('init database complete');
}

run().catch((error: Error) => {
    console.log(error.message);
}).finally(() => {
    process.exit(0);
});
