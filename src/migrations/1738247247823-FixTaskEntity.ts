import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTaskEntity1738247247823 implements MigrationInterface {
    name = 'FixTaskEntity1738247247823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "files"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "files" character varying NOT NULL`);
    }

}
