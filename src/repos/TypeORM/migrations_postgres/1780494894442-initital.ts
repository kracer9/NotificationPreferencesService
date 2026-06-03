import type { MigrationInterface, QueryRunner } from "typeorm";

export class Initital1780494894442 implements MigrationInterface {
    name = 'Initital1780494894442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer NOT NULL, "timezone" character varying, "quietHoursStart" TIME, "quietHoursEnd" TIME, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_type_enum" AS ENUM('transactional', 'marketing')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_channel_enum" AS ENUM('email', 'sms', 'push')`);
        await queryRunner.query(`CREATE TABLE "notification_preferences" ("id" SERIAL NOT NULL, "userId" integer, "type" "public"."notification_preferences_type_enum" NOT NULL, "channel" "public"."notification_preferences_channel_enum" NOT NULL, "enabled" boolean NOT NULL, CONSTRAINT "PK_e94e2b543f2f218ee68e4f4fad2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "FK_b70c44e8b00757584a393225593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_b70c44e8b00757584a393225593"`);
        await queryRunner.query(`DROP TABLE "notification_preferences"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
