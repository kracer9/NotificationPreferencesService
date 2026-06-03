import { DataSource } from "typeorm";
import { options } from "./PostgresDataSource.ts";

const dirname = import.meta.dirname;

export default new DataSource({
    ...options,
    migrations: [dirname + '/migrations_postgres/**/*{.js,.ts}'],
});
