import "dotenv/config";

export default {
    app: {
        port: process.env.APP_PORT,
        logs: {
            enabled: process.env.LOGS_ENABLED === 'true',
            path: process.env.LOGS_PATH,
        },
    },
    db: {
        postgres: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            user: process.env.POSTGRES_USER,
            pass: process.env.POSTGRES_PASS,
            database: process.env.POSTGRES_DB,
            schema: process.env.POSTGRES_SCHEMA,
        },
    },
};
