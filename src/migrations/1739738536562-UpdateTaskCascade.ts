import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskCascade1739738536562 implements MigrationInterface {
    name = 'UpdateTaskCascade1739738536562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
