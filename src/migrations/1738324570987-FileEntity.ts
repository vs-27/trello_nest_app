import { MigrationInterface, QueryRunner } from "typeorm";

export class FileEntity1738324570987 implements MigrationInterface {
    name = 'FileEntity1738324570987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4"`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "taskId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4"`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "taskId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
