import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskPosition1739736824971 implements MigrationInterface {
    name = 'UpdateTaskPosition1739736824971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "position" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "position"`);
    }

}
