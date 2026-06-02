import { DataSource } from "typeorm";
import { config } from "./PostgresDataSource.ts";

const dirname = import.meta.dirname;

export default new DataSource({
    ...config,
    migrations: [dirname + '/migrations_postgres/**/*{.js,.ts}'],
});
