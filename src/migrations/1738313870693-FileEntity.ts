import { MigrationInterface, QueryRunner } from "typeorm";

export class FileEntity1738313870693 implements MigrationInterface {
    name = 'FileEntity1738313870693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "filePath" character varying NOT NULL, "taskId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_c16e3dee54f3fecdc183c265ae4"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
