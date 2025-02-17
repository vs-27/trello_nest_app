import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskFixedFields1739827574493 implements MigrationInterface {
    name = 'UpdateTaskFixedFields1739827574493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "startTime" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "endTime" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "endTime" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "startTime" SET DEFAULT now()`);
    }

}
