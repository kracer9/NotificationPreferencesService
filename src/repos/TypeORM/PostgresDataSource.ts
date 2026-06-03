import config from "../../configs/config.ts";
import { DataSource, type DataSourceOptions } from "typeorm";
import NotificationPreferenceEntity from "./entities/NotificationPreferenceEntity.ts";
import UserEntity from "./entities/UserEntity.ts";

export const options: DataSourceOptions = {
    type: 'postgres',
    host: config.db.postgres.host,
    port: config.db.postgres.port,
    username: config.db.postgres.user,
    password: config.db.postgres.pass,
    database: config.db.postgres.database,
    schema: config.db.postgres.schema,
    synchronize: false,
    entities: [
        NotificationPreferenceEntity,
        UserEntity,
    ],
};

export default new DataSource(options);
