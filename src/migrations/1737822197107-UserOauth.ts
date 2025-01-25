import { MigrationInterface, QueryRunner } from "typeorm";

export class UserOauth1737822197107 implements MigrationInterface {
    name = 'UserOauth1737822197107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users-oauth" ("id" SERIAL NOT NULL, "profile" json, "tokensData" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_512fe302fe7ca44976ce601c5e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users-oauth" ADD CONSTRAINT "FK_0ece5833981d11af459fd83b3b0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users-oauth" DROP CONSTRAINT "FK_0ece5833981d11af459fd83b3b0"`);
        await queryRunner.query(`DROP TABLE "users-oauth"`);
    }

}
