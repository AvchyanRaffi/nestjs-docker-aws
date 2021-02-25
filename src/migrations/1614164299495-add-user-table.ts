import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1614164299495 implements MigrationInterface {
    name = 'addUserTable1614164299495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying, "role" text NOT NULL, "birth_date" TIMESTAMP, "password" character varying, "avatar" character varying, "phone" character varying, CONSTRAINT "UQ_630a929bfca852d724cb66820b8" UNIQUE ("email", "role"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
