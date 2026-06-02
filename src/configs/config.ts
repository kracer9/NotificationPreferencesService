import "dotenv/config";

export default {
    app: {
        port: 3000,
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
